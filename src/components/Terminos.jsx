import Header from './Header'

const secciones = [
  {
    h: '1. Identificacion de la plataforma',
    p: [
      'Expertos es una plataforma digital operada por [NOMBRE LEGAL DE LA EMPRESA O PERSONA RESPONSABLE], identificada con [NIT/IDENTIFICACION], con domicilio en [CIUDAD, COLOMBIA].',
      'Correo de contacto: [CORREO]',
      'Expertos facilita la interacción entre clientes y profesionales, permitiendo la publicación, busqueda, solicitud y contratación de servicios profesionales.'
    ]
  },
  {
    h: '2. Definiciones',
    p: ['Para efectos de estos terminos:'],
    ul: [
      'Plataforma: sitio web, aplicación y demas medios digitales administrados por Expertos.',
      'Cliente: persona natural o juridica que utiliza Expertos para buscar, solicitar o contratar servicios profesionales.',
      'Experto: persona natural o juridica que ofrece sus conocimientos, habilidades, experiencia o servicios profesionales a traves de Expertos.',
      'Usuario: cualquier persona que acceda o utilice la Plataforma, incluyendo Clientes y Expertos.',
      'Servicio: actividad profesional ofrecida por un Experto y solicitada o contratada por un Cliente.'
    ]
  },
  {
    h: '3. Funcionamiento de Expertos',
    p: ['Expertos funciona como una plataforma de conexion entre Clientes y Expertos.', 'La Plataforma permite a los usuarios:'],
    ul: [
      'Crear y administrar perfiles.',
      'Buscar profesionales.',
      'Publicar o solicitar necesidades.',
      'Consultar información profesional.',
      'Comunicarse con otros usuarios.',
      'Solicitar o acordar servicios.',
      'Consultar el estado de sus solicitudes o contrataciones.',
      'Calificar y recibir calificaciones, cuando esta función este disponible.'
    ],
    p2: [
      'Las condiciones particulares de cada servicio, incluyendo alcance, precio, duración, modalidad, fechas, entregables y demas condiciones, podrán ser acordadas entre el Cliente y el Experto.',
      'Expertos no establece necesariamente una única modalidad de contratación o cobro. Las partes podrán acordar las condiciones del servicio de acuerdo con las funcionalidades disponibles en la Plataforma y la legislación aplicable.'
    ]
  },
  {
    h: '4. Registro de usuarios',
    p: ['Para utilizar determinadas funcionalidades sera necesario crear una cuenta.', 'El usuario se compromete a proporcionar información verdadera, completa y actualizada.', 'El usuario es responsable de:'],
    ul: [
      'Mantener la confidencialidad de sus credenciales.',
      'No compartir su contraseña.',
      'Informar a Expertos sobre cualquier acceso no autorizado.',
      'Mantener actualizada su información.',
      'No crear cuentas utilizando información falsa o perteneciente a otra persona.'
    ],
    p2: ['Expertos podra solicitar información adicional para verificar la identidad o información proporcionada por un usuario cuando resulte necesario.']
  },
  {
    h: '5. Requisitos para los Expertos',
    p: [
      'Los Expertos deberán proporcionar información veraz sobre su experiencia, formación, conocimientos, certificaciones, habilidades y servicios ofrecidos.',
      'El Experto sera responsable de garantizar que la información publicada en su perfil sea cierta, actualizada y no induzca a error.',
      'Cuando una actividad profesional requiera licencia, matricula, tarjeta profesional, certificación, autorización o cualquier otro requisito legal, el Experto sera responsable de contar con las habilitaciones correspondientes.',
      'Expertos podra solicitar documentos o información para procesos de verificación.',
      'La verificación realizada por Expertos no constituye una garantía absoluta sobre la calidad, idoneidad o resultado de los servicios prestados por un Experto.'
    ]
  },
  {
    h: '6. Responsabilidades del Cliente',
    p: ['El Cliente se compromete a:'],
    ul: [
      'Proporcionar información verdadera sobre sus necesidades.',
      'Utilizar la Plataforma de manera licita.',
      'Respetar a los Expertos.',
      'Cumplir las condiciones acordadas para los servicios contratados.',
      'Realizar los pagos que correspondan segun las condiciones acordadas.',
      'No utilizar la Plataforma para actividades fraudulentas, ilegales o engañosas.'
    ]
  },
  {
    h: '7. Responsabilidades del Experto',
    p: ['El Experto se compromete a:'],
    ul: [
      'Proporcionar información verdadera sobre sus capacidades y experiencia.',
      'Prestar los servicios de acuerdo con las condiciones acordadas con el Cliente.',
      'Cumplir las obligaciones legales aplicables a su actividad profesional.',
      'Respetar la confidencialidad de la información recibida de los Clientes.',
      'No utilizar información de los Clientes para fines diferentes a los autorizados.',
      'No realizar actividades fraudulentas, ilegales, discriminatorias o engañosas.'
    ]
  },
  {
    h: '8. Acuerdos entre Clientes y Expertos',
    p: [
      'Las relaciones contractuales que surjan entre un Cliente y un Experto deberán regirse por las condiciones que las partes acuerden y por la legislación aplicable.',
      'Expertos podra proporcionar herramientas para facilitar la comunicación y contratación, pero no sustituye los acuerdos que correspondan entre las partes.',
      'Cuando la Plataforma ofrezca mecanismos de pago, facturación, contratación, garantías o gestión de controversias, estos estarán sujetos a las condiciones particulares informadas al usuario.'
    ]
  },
  {
    h: '9. Pagos',
    p: [
      'Cuando Expertos habilite funcionalidades de pago dentro de la Plataforma, las condiciones relacionadas con tarifas, comisiones, medios de pago, reembolsos, cancelaciones y demas aspectos economicos seran informadas antes de realizar la operación correspondiente.',
      'Cuando el pago sea acordado directamente entre Cliente y Experto por fuera de las funcionalidades de pago de Expertos, las condiciones de dicha operación seran responsabilidad de las partes.'
    ]
  },
  {
    h: '10. Contenido publicado por los usuarios',
    p: [
      'Los usuarios conservan los derechos que legalmente les correspondan sobre los contenidos que publiquen.',
      'Al publicar contenido en Expertos, el usuario autoriza a la Plataforma a utilizarlo en la medida necesaria para operar, mostrar, promocionar y mejorar los servicios de la Plataforma, de acuerdo con estos Terminos y la Politica de Tratamiento de Datos Personales.',
      'El usuario declara que tiene derecho a publicar el contenido suministrado y que este no infringe derechos de terceros.'
    ]
  },
  {
    h: '11. Conductas prohibidas',
    p: ['Esta prohibido utilizar Expertos para:'],
    ul: [
      'Realizar actividades ilicitas.',
      'Suplantar a otras personas.',
      'Publicar información falsa o engañosa.',
      'Intentar acceder a cuentas ajenas.',
      'Introducir virus, código malicioso o mecanismos que afecten la Plataforma.',
      'Utilizar información de otros usuarios para fines no autorizados.',
      'Realizar acoso, amenazas, discriminación o conductas abusivas.',
      'Publicar contenido que infrinja derechos de terceros.',
      'Utilizar la Plataforma para actividades fraudulentas.',
      'Manipular artificialmente calificaciones o reseñas.',
      'Utilizar herramientas automatizadas para extraer información de la Plataforma sin autorización.'
    ]
  },
  {
    h: '12. Perfiles, calificaciones y reseñas',
    p: [
      'Cuando esta funcionalidad este disponible, los usuarios podrán publicar calificaciones y comentarios sobre las experiencias obtenidas a traves de la Plataforma.',
      'Las calificaciones deberán ser honestas y basarse en experiencias reales.',
      'Expertos podra retirar contenido que incumpla estos Terminos, la legislación aplicable o las reglas de la comunidad.'
    ]
  },
  {
    h: '13. Suspension o cancelación de cuentas',
    p: ['Expertos podra suspender, limitar o cancelar una cuenta cuando existan razones para considerar que el usuario:'],
    ul: [
      'Incumple estos Terminos.',
      'Proporciono información falsa.',
      'Utiliza la Plataforma de manera fraudulenta.',
      'Representa un riesgo para otros usuarios o para la Plataforma.',
      'Incumple la legislación aplicable.'
    ],
    p2: ['Cuando resulte procedente, Expertos podra informar al usuario las razones de la medida adoptada.']
  },
  {
    h: '14. Disponibilidad de la Plataforma',
    p: [
      'Expertos procurara mantener la Plataforma disponible y funcionando correctamente.',
      'Sin embargo, pueden presentarse interrupciones derivadas de mantenimiento, actualizaciones, fallas tecnicas, proveedores externos, problemas de conectividad o circunstancias fuera del control razonable de Expertos.'
    ]
  },
  {
    h: '15. Limitacion de responsabilidad',
    p: [
      'Expertos actua como plataforma de conexion y facilitación entre Clientes y Expertos, salvo que expresamente se indique lo contrario para un servicio determinado.',
      'En consecuencia, cada Experto es responsable de los servicios que ofrece y presta, de la información que pública y del cumplimiento de las obligaciones legales relacionadas con su actividad.',
      'Los Clientes son responsables de las decisiones que adopten al seleccionar y contratar a un Experto.',
      'Lo anterior se aplicara sin perjuicio de las responsabilidades que legalmente correspondan a Expertos y de los derechos irrenunciables de los consumidores cuando resulten aplicables.'
    ]
  },
  {
    h: '16. Propiedad intelectual',
    p: [
      'Los elementos que conforman la Plataforma, incluyendo su software, diseño, marca, logotipos, textos, interfaces y demas elementos protegibles, pertenecen a Expertos o a sus respectivos titulares y estan protegidos por la legislación aplicable.',
      'El uso de la Plataforma no concede al usuario derechos de propiedad sobre dichos elementos.'
    ]
  },
  {
    h: '17. Proteccion de datos personales',
    p: [
      'El tratamiento de los datos personales de los usuarios se realizara de acuerdo con la Politica de Tratamiento de Datos Personales de Expertos, disponible en la Plataforma.',
      'El usuario declara conocer dicha Politica y, cuando corresponda, autoriza el tratamiento de sus datos personales en los terminos alli establecidos.'
    ]
  },
  {
    h: '18. Modificaciones',
    p: [
      'Expertos podra modificar estos Terminos cuando resulte necesario por cambios en la Plataforma, servicios, legislación o modelo de operación.',
      'Las modificaciones seran informadas a traves de los medios disponibles y entraran en vigencia en la fecha indicada en la version actualizada.'
    ]
  },
  {
    h: '19. Legislacion aplicable',
    p: ['Estos Terminos se regiran por las leyes aplicables de la Republica de Colombia.']
  },
  {
    h: '20. Contacto',
    p: ['Para preguntas, solicitudes o reclamos relacionados con estos Terminos:'],
    ul: ['Correo: [CORREO]', 'Direccion: [DIRECCION]', 'Responsable: [NOMBRE LEGAL]', 'NIT: [NIT]']
  }
]

function Terminos() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-[#2C3E50] mb-1">Terminos de Uso de Expertos</h2>
        <p className="text-sm text-gray-500 mb-6">Ultima actualización: [FECHA]</p>

        <p className="text-gray-700 text-sm mb-6">
          Bienvenido a Expertos, una plataforma digital que facilita la conexion entre personas y empresas
          que requieren servicios profesionales y personas que ofrecen conocimientos, habilidades y
          servicios especializados. Al registrarse, acceder o utilizar Expertos, el usuario declara que ha
          leido, comprendido y aceptado estos Terminos de Uso y se compromete a cumplirlos.
        </p>

        <div className="flex flex-col gap-5 text-gray-700 text-sm leading-relaxed">
          {secciones.map((sección) => (
            <section key={sección.h}>
              <h3 className="font-bold text-[#2C3E50] mb-1">{sección.h}</h3>
              {sección.p && sección.p.map((texto, i) => <p key={i} className="mb-1">{texto}</p>)}
              {sección.ul && (
                <ul className="list-disc list-inside mb-1">
                  {sección.ul.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              )}
              {sección.p2 && sección.p2.map((texto, i) => <p key={i} className="mb-1">{texto}</p>)}
            </section>
          ))}

          <p className="font-bold text-[#2C3E50] mt-2">
            Al crear una cuenta en Expertos, el usuario declara que ha leido y acepta estos Terminos de Uso.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Terminos