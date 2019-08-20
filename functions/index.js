process.env.GCLOUD_PROJECT = "demoutz-217701"
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.actualizarVentas = functions.firestore
    .document('ventas/{ventaID}')
    .onCreate((snap,context)=>{
        console.log("venta");
        const data = snap.data();
        console.log("snap.data:",data);
        console.log("context.params",context.params);
        /*iteracion de cada elemento para agregar las ventas al array y modificar las existencias de manera atomica*/
        var batch = db.batch();
        for(let item of data['items']){
            const refVentas = db.collection('articulos').doc(item.item).collection('historial').doc(snap.id);
            batch.set(refVentas ,{ ventaId:snap.id,fecha:data.fecha,cantidad:item.unidades});
            const articuloRef = db.collection('articulos').doc(item.item);
            let margenGanancia = item.unidades *( item.precio - item.costo);
            const unidades = +item.unidades;
            const enLimite= (item.limite>=(item.existencias-unidades));
            batch.update(articuloRef,
                    { 
                        ultimaVenta:data.fecha,    
                        ventasTotales: admin.firestore.FieldValue.increment(unidades),
                        ganancias:admin.firestore.FieldValue.increment(margenGanancia),
                        existencias:admin.firestore.FieldValue.increment(-unidades),
                        sobreLimite:enLimite,                                          
                    })
        }
        return batch.commit().then(x=>console.log('result: ',x))
                             .catch(err=>console.log('error: ',err))    
    });

exports.eliminarVenta = functions.firestore
    .document('ventas/{ventaID}')
    .onDelete(async (snap,context)=>{
        console.log("remover Venta");
        console.log("SnapId: ",snap.id);
        const data = snap.data();
        console.log("Datos: ",data);
        const ventaId = context.params.ventaID;
        console.log("VentaId: ",ventaId);
        var batch = db.batch();
        for (let item of data['items']){
            const refHistorial =  db.collection('articulos').doc(item.item).collection('historial').doc(ventaId);            
            batch.delete(refHistorial);            
            let fechaUltimaVenta =null;
            //obtener las 2 ultimas ventas del producto para actualizar la fecha de la ultima venta, si la eliminada es la actual se devuelve la siguiente
            const ultimasVentas = await db.collection('articulos').doc(item.item).collection('historial').orderBy('fecha','desc').limit(2).get();
            ultimasVentas.forEach(venta=>{
               /*verificar si el id de la venta es distinto para obtener la ultima venta, se realiza con 2 datos
               para evitar las eliminaciones con fechas anteriores y las eliminaciones de la ultima venta,
               en el caso de que la eliminacion sea la ultima venta se tomara la anterior, 
               en caso sea una anterior seguira figurando la ultima venta*/
                if((venta.data().ventaId !== ventaId) && fechaUltimaVenta==null ){
                    fechaUltimaVenta=venta.data().fecha;                    
                }
            })
            const _item = await db.collection('articulos').doc(item.item).get();
            const dataItem = _item.data();
            console.log('dataItem: ', dataItem);
            const ventasTotales=dataItem.ventasTotales-item.unidades;            
            let gananciaEstaVenta = item.unidades *( item.precio - item.costo);
            const ganancias = dataItem.ganancias-gananciaEstaVenta;
            const unidadesActuales= dataItem.existencias+item.unidades;
            const banderaLimite= (unidadesActuales<= dataItem.limite);
            const refArticulo = db.collection('articulos').doc(item.item);
            batch.update(refArticulo,
                    {ventasTotales : ventasTotales,//admin.firestore.FieldValue.increment(-item.unidades),
                     ganancias: ganancias,//admin.firestore.FieldValue.increment(-margenGanancia),
                     existencias : unidadesActuales,//admin.firestore.FieldValue.increment(item.unidades),
                     ultimaVenta: fechaUltimaVenta,
                     sobreLimite:  banderaLimite,
                    })
        }
        return batch.commit().then(x=>console.log('result: ',x))
                             .catch(err=>console.log('error: ',err))   
    })
