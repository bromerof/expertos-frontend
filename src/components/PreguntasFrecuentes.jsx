import { useState } from 'react'
import Header from './Header'

const secciones = [
  {
    titulo: 'General',
    preguntas: [
      {
        p: '¿Qué es EXPERTOS?',
        r: 'EXPERTOS es una plataforma que conecta a personas o empresas que necesitan un servicio con profesionales independientes que lo ofrecen. Tú buscas, contactas por WhatsApp, y acuerdas el servicio directamente con el experto.'
      },
      {
        p: '¿Es gratis usar la plataforma?',
        r: 'Sí, tanto buscar expertos (como cliente) como crear un perfil profesional (como experto) es gratuito. Los expertos tienen además la opción de un plan Pro con beneficios adicionales.'
      },
      {
        p: '¿Cómo protegen mis datos personales?',
        r: 'Seguimos la Ley 1581 de 2012 (Hábeas Data). Puedes ver el detalle completo en nuestra Política de Tratamiento de Datos Personales.'
      },
      {
        p: '¿Puedo eliminar mi cuenta?',
        r: 'Sí, desde tu panel puedes eliminar tu perfil en cualquier momento con el botón "Eliminar perfil".'
      }
    ]
  },
  {
    titulo: 'Para clientes',
    preguntas: [
      {
        p: '¿Cómo busco un experto?',
        r: 'Inicia sesión como cliente y ve a "Buscar expertos". Puedes filtrar por nombre, categoría, departamento o ciudad.'
      },
      {
        p: '¿Cómo contacto a un experto?',
        r: 'Desde su perfil o su tarjeta de resultados, presiona "Contactar por WhatsApp". Se abrirá una conversación directa con él, ya con un mensaje inicial listo para enviar.'
      },
      {
        p: '¿Por qué mi cuenta está pendiente de aprobación?',
        r: 'Un administrador revisa cada cuenta nueva antes de activarla, para mantener la plataforma segura. Esto normalmente toma poco tiempo; vuelve a iniciar sesión más tarde para verificar tu acceso.'
      },
      {
        p: '¿Qué pasa si tengo un problema con el servicio contratado?',
        r: 'EXPERTOS conecta a clientes y expertos, pero el servicio se acuerda y se presta directamente entre ambas partes. Te recomendamos dejar claras las condiciones antes de empezar, y puedes calificar tu experiencia al finalizar.'
      },
      {
        p: '¿Puedo confiar en las calificaciones que veo?',
        r: 'Las calificaciones las dejan clientes que efectivamente contactaron al experto a través de la plataforma. Aun así, te recomendamos usarlas como una referencia más, no como garantía absoluta.'
      }
    ]
  },
  {
    titulo: 'Para expertos',
    preguntas: [
      {
        p: '¿Cómo me registro como experto?',
        r: 'Entra a "Conviértete en experto", completa tu perfil con tu categoría, profesión, experiencia y ubicación, e inicia sesión después de registrarte.'
      },
      {
        p: '¿Qué necesito para ser aprobado?',
        r: 'Debes subir tu foto de perfil y las fotos (frente y reverso) de tu documento de identidad desde tu panel. Un administrador revisa esta información antes de aprobarte.'
      },
      {
        p: '¿Cuánto tarda la aprobación?',
        r: 'Una vez subas tu foto de perfil y tus documentos, normalmente toma entre 20 y 30 minutos. Te recomendamos volver a iniciar sesión pasado ese tiempo para verificar tu acceso completo.'
      },
      {
        p: '¿No encuentro mi profesión en la lista, qué hago?',
        r: 'Selecciona la opción "Otra" en categoría y/o profesión, y describe específicamente a qué te dedicas en el campo que aparece. Esto ayuda a que los clientes te encuentren igual.'
      },
      {
        p: '¿Qué es el plan Pro y en qué se diferencia del Free?',
        r: 'Con el plan Pro tu perfil aparece primero en los resultados de búsqueda, se muestra un sello "Pro" en tu perfil y tarjeta, y puedes publicar varias profesiones en una sola cuenta. El plan Free te permite crear tu perfil, aparecer en búsquedas y recibir contactos sin costo.'
      },
      {
        p: '¿Cómo activo el plan Pro?',
        r: 'Por ahora la activación del plan Pro está en fase de pruebas. Muy pronto podrás activarlo directamente desde tu panel con un pago real.'
      }
    ]
  }
]

function PreguntaAcordeon({ pregunta, respuesta, abierta, onToggle }) {
  return (
    <div className="bg-white border border-gray-200 rounded">
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex justify-between items-center gap-3 font-semibold text-[#2C3E50] cursor-pointer"
      >
        <span>{pregunta}</span>
        <span className="text-xl flex-shrink-0">{abierta ? '−' : '+'}</span>
      </button>
      {abierta && (
        <p className="px-4 pb-4 text-gray-700 text-sm leading-relaxed">{respuesta}</p>
      )}
    </div>
  )
}

function PreguntasFrecuentes() {
  const [abierta, setAbierta] = useState(null)

  const toggle = (clave) => {
    setAbierta(abierta === clave ? null : clave)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-[#2C3E50] mb-1">Preguntas frecuentes</h2>
        <p className="text-gray-500 text-sm mb-8">
          Si no encuentras la respuesta que buscas, usa el botón de soporte para escribirnos.
        </p>

        {secciones.map((seccion) => (
          <div key={seccion.titulo} className="mb-8">
            <h3 className="text-lg font-bold text-[#2C3E50] mb-3">{seccion.titulo}</h3>
            <div className="flex flex-col gap-2">
              {seccion.preguntas.map((item, i) => {
                const clave = seccion.titulo + i
                return (
                  <PreguntaAcordeon
                    key={clave}
                    pregunta={item.p}
                    respuesta={item.r}
                    abierta={abierta === clave}
                    onToggle={() => toggle(clave)}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PreguntasFrecuentes