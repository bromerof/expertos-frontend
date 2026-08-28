import Header from './Header'

const secciones = [
  {
    h: '1. Introduccion',
    p: [
      'En Expertos reconocemos la importancia de proteger la privacidad y los datos personales de nuestros usuarios.',
      'Esta Politica establece la forma en que recolectamos, almacenamos, utilizamos, consultamos, actualizamos, transmitimos, transferimos y, cuando corresponda, eliminamos los datos personales de las personas que utilizan nuestra Plataforma.',
      'El tratamiento de datos personales se realizara de acuerdo con la legislacion colombiana aplicable en materia de proteccion de datos personales.'
    ]
  },
  {
    h: '2. Responsable del tratamiento',
    p: ['El responsable del tratamiento de los datos personales es:'],
    ul: ['[NOMBRE LEGAL DE LA EMPRESA]', 'NIT: [NIT]', 'Domicilio: [CIUDAD]', 'Correo electronico: [CORREO]', 'Telefono: [TELEFONO]']
  },
  {
    h: '3. Datos que podemos recolectar',
    p: ['Dependiendo del tipo de usuario y de las funcionalidades utilizadas, Expertos podra recolectar:'],
    subsecciones: [
      { titulo: 'Datos de identificacion', items: ['Nombre y apellidos.', 'Tipo y numero de documento, cuando sea necesario.', 'Fecha de nacimiento, cuando sea necesaria.', 'Fotografia de perfil.'] },
      { titulo: 'Datos de contacto', items: ['Correo electronico.', 'Numero de telefono.', 'Ciudad o ubicacion general.', 'Informacion necesaria para facilitar la comunicacion entre usuarios.'] },
      { titulo: 'Informacion de Expertos', items: ['Profesion u ocupacion.', 'Experiencia profesional.', 'Formacion academica.', 'Habilidades.', 'Especialidades.', 'Certificaciones.', 'Portafolio.', 'Descripcion de servicios.', 'Informacion profesional adicional.', 'Documentos necesarios para procesos de verificacion, cuando correspondan.'] },
      { titulo: 'Informacion de uso', items: ['Acceso a la Plataforma.', 'Dispositivo utilizado.', 'Direccion IP.', 'Navegador.', 'Sistema operativo.', 'Fecha y hora de acceso.', 'Interacciones con la Plataforma.', 'Informacion tecnica necesaria para seguridad y funcionamiento.'] }
    ],
    p2: ['Informacion relacionada con servicios: podremos tratar informacion relacionada con solicitudes, conversaciones, contrataciones, calificaciones, reseñas y demas interacciones realizadas a traves de Expertos.']
  },
  {
    h: '4. Finalidades del tratamiento',
    p: ['Los datos personales podran ser tratados para las siguientes finalidades:'],
    ul: [
      'Crear y administrar cuentas de usuario.',
      'Identificar y autenticar usuarios.',
      'Facilitar la conexion entre Clientes y Expertos.',
      'Mostrar perfiles profesionales dentro de la Plataforma.',
      'Permitir la busqueda y seleccion de Expertos.',
      'Facilitar comunicaciones relacionadas con servicios.',
      'Gestionar solicitudes y contrataciones.',
      'Gestionar pagos cuando estos sean procesados mediante la Plataforma.',
      'Prevenir fraude, abuso y actividades no autorizadas.',
      'Mejorar la seguridad de la Plataforma.',
      'Atender solicitudes, preguntas, quejas y reclamos.',
      'Gestionar soporte tecnico.',
      'Cumplir obligaciones legales.',
      'Generar estadisticas y analisis para mejorar los servicios.',
      'Mejorar la experiencia de usuario.',
      'Enviar comunicaciones relacionadas con el funcionamiento de la cuenta.',
      'Enviar comunicaciones comerciales cuando el usuario haya otorgado la autorizacion correspondiente.',
      'Verificar informacion de los Expertos cuando esta funcionalidad este disponible.',
      'Gestionar calificaciones, reseñas y reputacion dentro de la Plataforma.'
    ]
  },
  {
    h: '5. Informacion visible en los perfiles',
    p: [
      'Cuando una persona se registre como Experto, determinados datos profesionales podran ser visibles para otros usuarios de Expertos, de acuerdo con la configuracion de la Plataforma.',
      'Estos podran incluir, entre otros:'
    ],
    ul: ['Nombre.', 'Fotografia.', 'Profesion u ocupacion.', 'Experiencia.', 'Especialidades.', 'Servicios ofrecidos.', 'Descripcion profesional.', 'Portafolio.', 'Calificaciones y reseñas.', 'Informacion profesional que el Experto decida publicar.'],
    p2: ['Los datos privados, credenciales de acceso y demas informacion que no sea necesaria para la presentacion publica del perfil no seran publicados como parte del perfil profesional.']
  },
  {
    h: '6. Autorizacion',
    p: [
      'Cuando la legislacion aplicable lo requiera, Expertos solicitara al titular una autorizacion previa, expresa e informada para el tratamiento de sus datos personales.',
      'La autorizacion podra ser obtenida mediante mecanismos fisicos o electronicos que permitan posteriormente acreditar su existencia.'
    ]
  },
  {
    h: '7. Datos sensibles',
    p: [
      'Expertos procurara no solicitar datos sensibles salvo que sean necesarios para una finalidad especifica y legitima y exista una base legal adecuada para su tratamiento.',
      'Cuando corresponda solicitar datos sensibles, se informara al titular sobre su caracter facultativo y se solicitara la autorizacion correspondiente.'
    ]
  },
  {
    h: '8. Derechos de los titulares',
    p: ['De acuerdo con la legislacion aplicable, los titulares de los datos personales podran:'],
    ul: [
      'Conocer los datos personales que Expertos tiene sobre ellos.',
      'Solicitar la actualizacion de sus datos.',
      'Solicitar la rectificacion de informacion inexacta o incompleta.',
      'Solicitar prueba de la autorizacion otorgada cuando corresponda.',
      'Conocer el uso que se ha dado a sus datos.',
      'Presentar quejas ante la Superintendencia de Industria y Comercio cuando consideren que se ha producido una infraccion de la normativa aplicable.',
      'Solicitar la supresion de sus datos cuando sea legalmente procedente.',
      'Revocar la autorizacion cuando sea procedente.',
      'Acceder gratuitamente a sus datos personales.'
    ]
  },
  {
    h: '9. Atencion de consultas y reclamos',
    p: ['Los titulares podran presentar consultas, solicitudes, peticiones o reclamos relacionados con sus datos personales a traves de:'],
    ul: ['Correo: [CORREO DE DATOS]', 'Direccion: [DIRECCION]'],
    p2: [
      'La solicitud debera permitir identificar al titular y explicar claramente la peticion.',
      'Expertos atendera las solicitudes dentro de los terminos establecidos por la legislacion colombiana aplicable.'
    ]
  },
  {
    h: '10. Seguridad de la informacion',
    p: [
      'Expertos implementara medidas tecnicas, administrativas y organizacionales razonables para proteger los datos personales frente a perdida, acceso no autorizado, alteracion, uso indebido o divulgacion no autorizada.',
      'Sin embargo, ningun sistema conectado a Internet puede garantizar seguridad absoluta.'
    ]
  },
  {
    h: '11. Conservacion de los datos',
    p: [
      'Los datos personales seran conservados durante el tiempo necesario para cumplir las finalidades informadas, atender obligaciones legales, resolver controversias y ejercer derechos, o durante los periodos establecidos por la legislacion aplicable.',
      'Cuando los datos ya no sean necesarios y no exista obligacion legal de conservarlos, Expertos podra proceder a su eliminacion, anonimizacion o bloqueo, segun corresponda.'
    ]
  },
  {
    h: '12. Encargados y proveedores',
    p: ['Expertos podra utilizar proveedores tecnologicos que actuen como encargados del tratamiento, por ejemplo para:'],
    ul: ['Alojamiento de informacion.', 'Servicios de correo electronico.', 'Autenticacion.', 'Analitica.', 'Seguridad.', 'Procesamiento de pagos.', 'Atencion al usuario.', 'Servicios de infraestructura tecnologica.'],
    p2: ['Estos proveedores unicamente podran acceder a la informacion necesaria para prestar los servicios contratados y estaran sujetos a las obligaciones correspondientes.']
  },
  {
    h: '13. Transferencia y transmision de datos',
    p: ['Cuando sea necesario utilizar proveedores ubicados fuera de Colombia, Expertos podra realizar transferencias o transmisiones internacionales de datos de acuerdo con los requisitos establecidos por la legislacion aplicable.']
  },
  {
    h: '14. Cookies y tecnologias similares',
    p: ['Expertos podra utilizar cookies y tecnologias similares para:'],
    ul: ['Mantener sesiones iniciadas.', 'Recordar preferencias.', 'Mejorar la seguridad.', 'Analizar el uso de la Plataforma.', 'Mejorar la experiencia del usuario.'],
    p2: ['Cuando corresponda, el usuario podra gestionar determinadas preferencias de cookies mediante las herramientas disponibles en la Plataforma.']
  },
  {
    h: '15. Datos de menores de edad',
    p: [
      'Expertos no esta dirigido a menores de edad, salvo que expresamente se indique lo contrario.',
      'Cuando excepcionalmente se realice tratamiento de datos personales de niños, niñas o adolescentes, se aplicaran las reglas y garantias establecidas por la legislacion colombiana.'
    ]
  },
  {
    h: '16. Actualizaciones de esta politica',
    p: [
      'Expertos podra modificar esta Politica cuando sea necesario debido a cambios legales, tecnologicos, operativos o en los servicios ofrecidos.',
      'La version vigente estara disponible en la Plataforma indicando su fecha de actualizacion.'
    ]
  },
  {
    h: '17. Contacto',
    p: ['Para cualquier inquietud relacionada con el tratamiento de datos personales:'],
    ul: ['Responsable: [NOMBRE LEGAL]', 'NIT: [NIT]', 'Correo: [CORREO]', 'Telefono: [TELEFONO]', 'Direccion: [DIRECCION]']
  }
]

function PoliticaDatos() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-[#2C3E50] mb-1">
          Politica de Tratamiento de Datos Personales de Expertos
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          En cumplimiento de la Ley 1581 de 2012 (Habeas Data) — Ultima actualizacion: [FECHA]
        </p>

        <div className="flex flex-col gap-5 text-gray-700 text-sm leading-relaxed">
          {secciones.map((seccion) => (
            <section key={seccion.h}>
              <h3 className="font-bold text-[#2C3E50] mb-1">{seccion.h}</h3>
              {seccion.p && seccion.p.map((texto, i) => <p key={i} className="mb-1">{texto}</p>)}
              {seccion.ul && (
                <ul className="list-disc list-inside mb-1">
                  {seccion.ul.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              )}
              {seccion.subsecciones && seccion.subsecciones.map((sub) => (
                <div key={sub.titulo} className="mt-2">
                  <p className="font-semibold">{sub.titulo}</p>
                  <ul className="list-disc list-inside mb-1">
                    {sub.items.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              ))}
              {seccion.p2 && seccion.p2.map((texto, i) => <p key={i} className="mb-1 mt-1">{texto}</p>)}
            </section>
          ))}

          <p className="font-bold text-[#2C3E50] mt-2">
            Al registrarse y cuando corresponda otorgar la autorizacion para el tratamiento de datos
            personales, el usuario declara haber sido informado sobre el tratamiento de sus datos y haber
            podido consultar esta Politica.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PoliticaDatos