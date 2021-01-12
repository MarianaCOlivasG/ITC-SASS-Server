const { Schema, model, Types } = require('mongoose');

const AlumnoSchema = Schema({
    /* =============
    == REQUERIDOS 
    ================*/
    nombre: { type: String, required: true },
    apellido_paterno: { type: String }, 
    apellido_materno: { type: String }, 
    sexo: { type: String, required: true },
    fecha_nacimiento: { type: Date, required: true },
    numero_control: { type: String, required: true, unique: true },
    carrera: { type: Types.ObjectId, ref: 'Carrera', required: true },
    semestre: { type: Number, required: true },
    creditos_acumulados: { type: Number, required: true },
    /* =============
    == FIN REQUERIDOS 
    ================*/

    email: { type: String },
    telefono: { type: String },
    domicilio: { type: String },
    numero_seguro: { type: String },
    edad: { type: Number },
    porcentaje_avance: { type: Number },
    
    periodo: { type: String },
    firma: { type: String }, 
    foto: { type: String },
    password: { type: String, required: true },
    proyecto: { type: Types.ObjectId, ref: 'Proyecto' },

    video: { type: Boolean, default: false },
    examen: { type: Boolean, default: false },
    terminos: { type: Boolean, default: false },
    online: { type: Boolean, default: false }

}, { collection: 'alumnos', timestamps: { createdAt: 'created_at' } });


AlumnoSchema.method('toJSON', function() {
    const { __v, password, created_at, updatedAt, fecha_nacimiento, ...object } = this.toObject(); 
    const bDate = new Date(fecha_nacimiento);
    object.fecha_nacimiento =  bDate.toISOString().substring(0,10);
    return object;
})

AlumnoSchema.pre('save', function(next){

    // Calcular Edad
    let hoy = new Date();
    let cumple = new Date(this.fecha_nacimiento);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    let m = hoy.getMonth() - cumple.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
        edad--;
    }
    
    this.edad = edad;
    // Fin Calcular Edad


    // Calcular % Avance
    let porcentaje = ( this.creditos_acumulados * 100 ) / 260;
    let t = porcentaje.toString();
    this.porcentaje_avance = t.match(/(\d*.\d{0,2})/)[0];
    // Fin Calcular % Avance
    
    next();
});
 

module.exports = model('Alumno', AlumnoSchema)