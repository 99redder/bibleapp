// Spanish install steps, same keys as INSTALL_GUIDES. Phone menus word things
// differently by region, so the common alternatives are named too.

export const INSTALL_GUIDES_ES = {
  'ios-safari': {
    label: 'iPhone o iPad — Safari',
    steps: [
      {
        title: 'Toque el botón Compartir',
        detail: 'Es el cuadrado con una flecha hacia arriba — abajo en Safari del iPhone, o arriba en el iPad. Si solo ve •••, tóquelo primero y luego Compartir.',
        hint: { icon: 'share', label: 'Compartir' }
      },
      {
        title: 'Elija «Agregar a inicio»',
        detail: 'Baje por la lista de opciones para encontrarlo (en algunos teléfonos dice «Añadir a pantalla de inicio»). Si no aparece, toque «Ver más» o «Editar acciones».',
        hint: { icon: 'add', label: 'Agregar a inicio' }
      },
      {
        title: 'Toque «Agregar»',
        detail: 'Deje el nombre «Bible Reading Plan». Si ve «Abrir como app web», déjelo activado.',
        hint: { icon: 'confirm', label: 'Agregar' }
      },
      {
        title: 'Ábrala desde su pantalla de inicio',
        detail: 'Toque el nuevo ícono de Bible Reading Plan. Inicie sesión una vez — la aplicación guarda su propia sesión, aparte de Safari.',
        hint: { icon: 'app', label: 'Bible Reading Plan' }
      }
    ]
  },

  'ios-other': {
    label: 'iPhone o iPad — Chrome, Edge o Firefox',
    steps: [
      {
        title: 'Toque el botón Compartir',
        detail: 'En Chrome está en la barra de direcciones, arriba. En Edge o Firefox, abra el menú y elija Compartir.',
        hint: { icon: 'share', label: 'Compartir' }
      },
      {
        title: 'Elija «Agregar a inicio»',
        detail: 'Baje para encontrarlo. Si no lo ve, abra biblereadingplan.app en Safari y siga los pasos para Safari.',
        hint: { icon: 'add', label: 'Agregar a inicio' }
      },
      {
        title: 'Toque «Agregar»',
        detail: 'Deje el nombre «Bible Reading Plan».',
        hint: { icon: 'confirm', label: 'Agregar' }
      },
      {
        title: 'Ábrala desde su pantalla de inicio',
        detail: 'Toque el nuevo ícono de Bible Reading Plan e inicie sesión una vez — la aplicación guarda su propia sesión.',
        hint: { icon: 'app', label: 'Bible Reading Plan' }
      }
    ]
  },

  'android-chrome': {
    label: 'Android — Chrome',
    oneTap: true,
    steps: [
      {
        title: 'Toque el menú',
        detail: 'Son los tres puntos ⋮ en la esquina superior derecha de Chrome.',
        hint: { icon: 'dots-vertical', label: 'Menú' }
      },
      {
        title: 'Toque «Instalar app» o «Agregar a la pantalla principal»',
        detail: 'Según su teléfono, Chrome puede usar cualquiera de estos nombres, o «Añadir a pantalla de inicio».',
        hint: { icon: 'add', label: 'Instalar app' }
      },
      {
        title: 'Toque «Instalar»',
        detail: 'Confirme, y Chrome agregará Bible Reading Plan a su pantalla de inicio.',
        hint: { icon: 'confirm', label: 'Instalar' }
      },
      {
        title: 'Ábrala desde su pantalla de inicio',
        detail: 'Toque el ícono de Bible Reading Plan. También la encontrará en su lista de aplicaciones.',
        hint: { icon: 'app', label: 'Bible Reading Plan' }
      }
    ]
  },

  'android-samsung': {
    label: 'Android — Samsung Internet',
    oneTap: true,
    steps: [
      {
        title: 'Toque el menú',
        detail: 'Son las tres rayas ≡ abajo a la derecha. (Si ve un ícono de instalar en la barra de direcciones, puede tocarlo en su lugar.)',
        hint: { icon: 'menu', label: 'Menú' }
      },
      {
        title: 'Toque «Añadir página a» y luego «Pantalla de inicio»',
        detail: 'En algunas versiones se llama «Instalar» o «Añadir a pantalla de inicio».',
        hint: { icon: 'add', label: 'Pantalla de inicio' }
      },
      {
        title: 'Toque «Añadir»',
        detail: 'Bible Reading Plan se agrega a su pantalla de inicio.',
        hint: { icon: 'confirm', label: 'Añadir' }
      },
      {
        title: 'Ábrala desde su pantalla de inicio',
        detail: 'Toque el ícono de Bible Reading Plan para empezar a leer.',
        hint: { icon: 'app', label: 'Bible Reading Plan' }
      }
    ]
  },

  'android-firefox': {
    label: 'Android — Firefox',
    steps: [
      {
        title: 'Toque el menú',
        detail: 'Son los tres puntos ⋮ — arriba o abajo a la derecha, según dónde tenga la barra de herramientas.',
        hint: { icon: 'dots-vertical', label: 'Menú' }
      },
      {
        title: 'Toque «Añadir a la pantalla de inicio»',
        detail: 'También puede llamarse «Agregar a pantalla de inicio» o «Instalar».',
        hint: { icon: 'add', label: 'Añadir a la pantalla de inicio' }
      },
      {
        title: 'Toque «Añadir»',
        detail: 'Bible Reading Plan se agrega a su pantalla de inicio.',
        hint: { icon: 'confirm', label: 'Añadir' }
      },
      {
        title: 'Ábrala desde su pantalla de inicio',
        detail: 'Toque el ícono de Bible Reading Plan para empezar a leer.',
        hint: { icon: 'app', label: 'Bible Reading Plan' }
      }
    ]
  },

  'desktop-chromium': {
    label: 'Computadora — Chrome o Edge',
    oneTap: true,
    steps: [
      {
        title: 'Haga clic en el ícono de instalar en la barra de direcciones',
        detail: 'Al lado derecho de la barra de direcciones, busque una pantallita con una flecha hacia abajo.',
        hint: { icon: 'install', label: 'Instalar Bible Reading Plan' }
      },
      {
        title: '¿No hay ícono? Use el menú del navegador',
        detail: 'Chrome: ⋮ → Enviar, guardar y compartir → Instalar página como aplicación. Edge: ··· → Aplicaciones → Instalar este sitio como una aplicación.',
        hint: { icon: 'dots-vertical', label: 'Menú' }
      },
      {
        title: 'Haga clic en «Instalar»',
        detail: 'Bible Reading Plan se abre en su propia ventana.',
        hint: { icon: 'confirm', label: 'Instalar' }
      },
      {
        title: 'Ábrala como cualquier otra aplicación',
        detail: 'Busque Bible Reading Plan en el Dock, la barra de tareas, el menú Inicio o la carpeta Aplicaciones.',
        hint: { icon: 'app', label: 'Bible Reading Plan' }
      }
    ]
  },

  'desktop-safari': {
    label: 'Mac — Safari',
    steps: [
      {
        title: 'Elija Archivo → Agregar al Dock',
        detail: 'Está en la barra de menús, arriba de la pantalla (en algunas Mac dice «Añadir al Dock»). También puede hacer clic en el botón Compartir y elegirlo ahí. (Requiere macOS Sonoma o posterior.)',
        hint: { icon: 'share', label: 'Agregar al Dock' }
      },
      {
        title: 'Haga clic en «Agregar»',
        detail: 'Deje el nombre «Bible Reading Plan».',
        hint: { icon: 'confirm', label: 'Agregar' }
      },
      {
        title: 'Ábrala desde el Dock',
        detail: 'Bible Reading Plan se abre en su propia ventana. Inicie sesión una vez — la aplicación guarda su propia sesión.',
        hint: { icon: 'app', label: 'Bible Reading Plan' }
      }
    ]
  },

  'desktop-firefox': {
    label: 'Computadora — Firefox',
    unsupported: true,
    steps: [
      {
        title: 'Firefox en computadoras no puede instalar aplicaciones',
        detail: 'Abra biblereadingplan.app en Chrome, Edge o Safari para instalarla — o instálela en su teléfono.',
        hint: { icon: 'browser', label: 'Abrir en otro navegador' },
        action: 'copy-link'
      }
    ]
  },

  'in-app': {
    label: 'Dentro de Facebook, Instagram u otra aplicación',
    steps: [
      {
        title: 'Abra esta página en su navegador',
        detail: 'Aplicaciones como Facebook e Instagram abren los enlaces en su propio visor, que no puede instalar aplicaciones. Toque el menú ••• o ⋮ (normalmente arriba a la derecha) y elija «Abrir en el navegador» o «Abrir en Safari».',
        hint: { icon: 'dots-horizontal', label: 'Abrir en el navegador' }
      },
      {
        title: 'O copie el enlace',
        detail: 'Luego péguelo en Safari (iPhone) o Chrome (Android).',
        hint: { icon: 'browser', label: 'biblereadingplan.app' },
        action: 'copy-link'
      },
      {
        title: 'Luego siga los pasos para su navegador',
        detail: 'Cuando la página esté abierta en su navegador, vuelva a esta guía para los siguientes pasos.',
        hint: { icon: 'app', label: 'Bible Reading Plan' },
        action: 'switch-to-browser'
      }
    ]
  }
}
