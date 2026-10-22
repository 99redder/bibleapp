import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogoBadge } from '../components/ui/BrandLogo'
import { useLanguage, useT } from '../i18n'

// Screenshots live in public/faq. They were captured at 2x on a 390px-wide
// phone from the real screens with sample data, so the sizes below are pixels.
function Screenshot({ src, alt, width, height }) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      className="mx-auto block h-auto w-full max-w-xs rounded-xl border border-gray-200 shadow-sm dark:border-gray-700"
    />
  )
}

// Written for older readers: plain words, every answer visible without tapping.
const QUESTIONS = [
  {
    question: 'Does this cost any money?',
    answer: (
      <p>
        No. Bible Reading Plan is completely free, and it will stay that way. There's no subscription, no in-app
        purchases, no ads, and you never need a credit card.
      </p>
    )
  },
  {
    question: "Why don't you have the NIV?",
    answer: (
      <>
        <p>
          The NIV (New International Version) is owned by a publisher, and its license doesn't allow it to be built
          into a free app like this one. All 11 translations in Bible Reading Plan are free for anyone to share, which
          is why we can include them.
        </p>
        <p>
          If you like the NIV, try the <strong>Berean Standard Bible (BSB)</strong> or the{' '}
          <strong>World English Bible (WEB)</strong>. Both are written in clear, modern English. You can switch
          translations anytime with Change plan.
        </p>
      </>
    )
  },
  {
    question: "What's the longest time I can choose for my plan?",
    answer: (
      <>
        <p>
          <strong>Up to 10 years (120 months).</strong>
        </p>
        <p>
          When you set up your plan, pick 6, 12, 18, or 24 months, choose to finish by the end of the year, or tap{' '}
          <strong>Custom duration</strong> and enter any number of months from 1 to 120. The longer your plan, the
          shorter each day's reading. A 10-year plan is about 9 verses a day.
        </p>
        <Screenshot
          src="/faq/plan-length.webp"
          alt="The Reading timeline step with Custom duration chosen and 120 months entered, showing about 9 verses per day"
          width={756}
          height={1528}
        />
        <p>Need more time later? Change plan lets you add up to 3 more years at a time.</p>
      </>
    )
  },
  {
    question: 'Can I change my plan after I make one?',
    answer: (
      <>
        <p>
          Yes, anytime. On the main screen, tap the <strong>gear button</strong> at the top, then tap{' '}
          <strong>Change plan</strong>.
        </p>
        <Screenshot
          src="/faq/change-plan-menu.webp"
          alt="The gear button at the top right is circled, and the menu under it has Change plan circled"
          width={780}
          height={666}
        />
        <p>
          You can switch your Bible translation, give yourself more or less time, include or skip weekends, or read
          just the Old or New Testament. Before you save, you'll see your new daily reading and finish date.
        </p>
        <Screenshot
          src="/faq/change-plan.webp"
          alt="The Change your plan screen with a new timeframe chosen and a preview of the new schedule and finish date"
          width={780}
          height={1718}
        />
        <p>The readings you've already finished, your streak, and your calendar are all kept.</p>
      </>
    )
  },
  {
    question: 'How do I start over?',
    answer: (
      <>
        <p>
          If you only want a different pace, translation, or timeline, use <strong>Change plan</strong> instead. It
          keeps everything you've already read.
        </p>
        <p>
          To begin a brand-new plan from the very beginning, tap the <strong>gear button</strong> at the top of the
          main screen, then tap <strong>Start Fresh</strong>.
        </p>
        <Screenshot
          src="/faq/start-over-menu.webp"
          alt="The gear button at the top right is circled, and the menu under it has Start Fresh circled"
          width={780}
          height={666}
        />
        <p>
          You'll be asked to confirm. Start Fresh deletes your current plan and all your progress, including your
          streak and calendar, and it can't be undone. Then you'll set up a new plan.
        </p>
        <Screenshot
          src="/faq/start-over-confirm.webp"
          alt="The Start Fresh confirmation, warning that it deletes your current plan and all progress, with Cancel and Start Fresh buttons"
          width={716}
          height={444}
        />
      </>
    )
  },
  {
    question: "How will I know if I'm ahead or behind?",
    answer: (
      <>
        <p>
          Look at the <strong>Your Progress</strong> box on the main screen. It tells you whether you're on track, or
          how many days ahead or behind you are.
        </p>
        <Screenshot
          src="/faq/progress.webp"
          alt="The Your Progress box showing 3 days ahead, Day 64 of 365"
          width={756}
          height={620}
        />
        <p>
          To see each day, tap the <strong>calendar button</strong> at the top of the main screen. Green days are days
          you read, and red days are days you missed.
        </p>
        <Screenshot
          src="/faq/calendar.webp"
          alt="The calendar with green circles on days that were read and a red circle on a missed day"
          width={756}
          height={922}
        />
      </>
    )
  },
  {
    question: 'I missed some days. How do I catch up?',
    answer: (
      <>
        <p>
          Don't worry, nothing gets skipped. Your next reading is always the one right after the last one you
          finished, and the <strong>Your Progress</strong> box shows how many days behind you are.
        </p>
        <Screenshot
          src="/faq/progress-behind.webp"
          alt="The Your Progress box showing 2 days behind, Day 59 of 365"
          width={756}
          height={620}
        />
        <p>
          To catch up, read more than one reading in a day. After you tap <strong>Mark as Read</strong>, the next
          reading appears right away, so you can keep going.
        </p>
        <p>
          If you'd rather not double up, use <strong>Change plan</strong> to give yourself more time. It spreads the
          rest of your readings out starting today and puts you back on track.
        </p>
      </>
    )
  },
  {
    question: 'What are the fun facts?',
    answer: (
      <>
        <p>
          Fun facts are short, true stories about how the passage you're reading shows up in the wider world: songs,
          movies, art, history, sports, space, and everyday sayings. Each one tells you where the information came
          from. They're just for fun and don't explain or interpret the Bible.
        </p>
        <p>
          When a chapter or verse has a fun fact, you'll see a small <strong>sparkle button</strong> next to it. Tap
          it to read the fact.
        </p>
        <Screenshot
          src="/faq/fun-facts-marker.webp"
          alt="Today's reading with a small sparkle button circled next to the 1 Samuel 17 heading"
          width={756}
          height={760}
        />
        <Screenshot
          src="/faq/fun-facts-sheet.webp"
          alt="A fun fact titled David and Goliath, with its source and a Back to reading button"
          width={780}
          height={640}
        />
        <p>
          Fun facts never pop up on their own, so they won't interrupt your reading. To turn them on or off, tap the{' '}
          <strong>gear button</strong> at the top of the main screen, then tap the <strong>Fun facts</strong> switch.
        </p>
        <Screenshot
          src="/faq/fun-facts-toggle.webp"
          alt="The gear button and the Fun facts switch in the menu are circled"
          width={780}
          height={666}
        />
      </>
    )
  },
  {
    question: 'Can I use it on my phone and my tablet or computer?',
    answer: (
      <>
        <p>
          Yes. Sign in with the same account on each one. Your plan and progress are saved to your account, so what
          you read on one shows up on the others.
        </p>
        <p>
          Sign in the same way you signed up: with your email and password, or with <strong>Continue with
          Google</strong>.
        </p>
        <p>
          If you added Bible Reading Plan to an iPhone or iPad home screen, sign in once inside that app too. It keeps
          its own sign-in, separate from Safari.
        </p>
      </>
    )
  },
  {
    question: 'I forgot my password. What do I do?',
    answer: (
      <>
        <p>
          On the sign-in screen, type your email address in the <strong>Email</strong> box, then tap{' '}
          <strong>Forgot your password?</strong> We'll email you a link to set a new password. If it doesn't arrive
          in a few minutes, check your junk or spam folder.
        </p>
        <Screenshot
          src="/faq/forgot-password.webp"
          alt="The sign-in box with an email address typed in and Forgot your password? circled"
          width={756}
          height={880}
        />
        <p>
          If you signed up with <strong>Continue with Google</strong>, you don't have a separate password for Bible
          Reading Plan. Just tap Continue with Google.
        </p>
      </>
    )
  }
]

// Shown instead to signed-in Spanish readers. Same plain style; the sign-in
// screen is English, so its buttons are named as they appear there.
const QUESTIONS_ES = [
  {
    question: '¿Cuesta dinero?',
    answer: (
      <p>
        No. Bible Reading Plan es totalmente gratis, y siempre lo será. No hay suscripción, ni compras dentro de la
        aplicación, ni anuncios, y nunca necesitará una tarjeta de crédito.
      </p>
    )
  },
  {
    question: '¿Por qué no está la Reina-Valera 1960 ni la NVI?',
    answer: (
      <>
        <p>
          La Reina-Valera 1960 y la Nueva Versión Internacional (NVI) tienen derechos de autor, y sus licencias no
          permiten incluirlas en una aplicación gratuita como esta. Las 3 traducciones en español de Bible Reading Plan
          se pueden compartir libremente, y por eso podemos incluirlas.
        </p>
        <p>
          Si le gusta la Reina-Valera 1960, pruebe la <strong>Reina-Valera 1909</strong>: es la revisión anterior de
          la misma traducción y su lenguaje es muy parecido. Si prefiere un español más moderno, pruebe la{' '}
          <strong>Versión Biblia Libre (VBL)</strong>. Puede cambiar de traducción cuando quiera con Cambiar plan.
        </p>
      </>
    )
  },
  {
    question: '¿Cuál es el plazo más largo que puedo elegir?',
    answer: (
      <>
        <p>
          <strong>Hasta 10 años (120 meses).</strong>
        </p>
        <p>
          Al crear su plan, elija 6, 12, 18 o 24 meses, elija terminar antes de fin de año, o toque{' '}
          <strong>Otra duración</strong> y escriba cualquier número de meses del 1 al 120. Mientras más largo sea su
          plan, más corta será la lectura de cada día. Un plan de 10 años es de unos 9 versículos por día.
        </p>
        <Screenshot
          src="/faq/es/plan-length.webp"
          alt="El paso Duración del plan con Otra duración elegida y 120 meses escritos, que muestra unos 9 versículos por día"
          width={756}
          height={1480}
        />
        <p>¿Necesita más tiempo después? Con Cambiar plan puede añadir hasta 3 años más cada vez.</p>
      </>
    )
  },
  {
    question: '¿Puedo cambiar mi plan después de crearlo?',
    answer: (
      <>
        <p>
          Sí, cuando quiera. En la pantalla principal, toque el <strong>botón del engranaje</strong> arriba y luego
          toque <strong>Cambiar plan</strong>.
        </p>
        <Screenshot
          src="/faq/es/change-plan-menu.webp"
          alt="El botón del engranaje arriba a la derecha está marcado, y en el menú de abajo está marcado Cambiar plan"
          width={780}
          height={616}
        />
        <p>
          Puede cambiar su traducción de la Biblia, darse más o menos tiempo, incluir o saltar los fines de semana, o
          leer solo el Antiguo o el Nuevo Testamento. Antes de guardar, verá su nueva lectura diaria y la fecha en que
          terminará.
        </p>
        <Screenshot
          src="/faq/es/change-plan.webp"
          alt="La pantalla Cambiar su plan con un nuevo plazo elegido y un resumen del nuevo plan y la fecha final"
          width={780}
          height={1766}
        />
        <p>Las lecturas que ya terminó, su racha y su calendario se conservan.</p>
      </>
    )
  },
  {
    question: '¿Cómo empiezo de nuevo?',
    answer: (
      <>
        <p>
          Si solo quiere otro ritmo, otra traducción u otro plazo, use <strong>Cambiar plan</strong>. Así conserva
          todo lo que ya leyó.
        </p>
        <p>
          Para comenzar un plan completamente nuevo desde el principio, toque el <strong>botón del engranaje</strong>{' '}
          arriba en la pantalla principal y luego toque <strong>Empezar de nuevo</strong>.
        </p>
        <Screenshot
          src="/faq/es/start-over-menu.webp"
          alt="El botón del engranaje arriba a la derecha está marcado, y en el menú de abajo está marcado Empezar de nuevo"
          width={780}
          height={616}
        />
        <p>
          Se le pedirá que confirme. Empezar de nuevo borra su plan actual y todo su progreso, incluidos su racha y su
          calendario, y no se puede deshacer. Después creará un plan nuevo.
        </p>
        <Screenshot
          src="/faq/es/start-over-confirm.webp"
          alt="La confirmación ¿Empezar de nuevo?, que advierte que se borrará su plan y todo su progreso, con los botones Cancelar y Empezar de nuevo"
          width={716}
          height={488}
        />
      </>
    )
  },
  {
    question: '¿Cómo sé si voy al día con mi plan?',
    answer: (
      <>
        <p>
          Mire el cuadro <strong>Su progreso</strong> en la pantalla principal. Le dice si va al día, o cuántos días de
          adelanto o de atraso lleva.
        </p>
        <Screenshot
          src="/faq/es/progress.webp"
          alt="El cuadro Su progreso, que muestra 3 días de adelanto, Día 64 de 365"
          width={756}
          height={620}
        />
        <p>
          Para ver cada día, toque el <strong>botón del calendario</strong> arriba en la pantalla principal. Los días en
          verde son los que leyó, y los días en rojo son los que no leyó.
        </p>
        <Screenshot
          src="/faq/es/calendar.webp"
          alt="El calendario con círculos verdes en los días leídos y un círculo rojo en un día sin leer"
          width={756}
          height={922}
        />
      </>
    )
  },
  {
    question: 'Me salté algunos días. ¿Cómo me pongo al día?',
    answer: (
      <>
        <p>
          No se preocupe, no se pierde nada. Su próxima lectura siempre es la que sigue a la última que terminó, y el
          cuadro <strong>Su progreso</strong> muestra cuántos días de atraso lleva.
        </p>
        <Screenshot
          src="/faq/es/progress-behind.webp"
          alt="El cuadro Su progreso, que muestra 2 días de atraso, Día 59 de 365"
          width={756}
          height={620}
        />
        <p>
          Para ponerse al día, lea más de una lectura en un día. Después de tocar <strong>Marcar como leída</strong>,
          la siguiente lectura aparece enseguida, así que puede seguir leyendo.
        </p>
        <p>
          Si prefiere no leer el doble, use <strong>Cambiar plan</strong> para darse más tiempo. Reparte el resto de
          sus lecturas a partir de hoy, y usted vuelve a quedar al día.
        </p>
      </>
    )
  },
  {
    question: '¿Puedo usarla en mi teléfono y en mi tableta o computadora?',
    answer: (
      <>
        <p>
          Sí. Inicie sesión con la misma cuenta en cada uno. Su plan y su progreso se guardan en su cuenta, así que lo
          que lea en uno aparece en los demás.
        </p>
        <p>
          Inicie sesión de la misma forma en que se registró: con su correo y contraseña, o con{' '}
          <strong>Continue with Google</strong>. (La pantalla para iniciar sesión está en inglés.)
        </p>
        <p>
          Si agregó Bible Reading Plan a la pantalla de inicio de un iPhone o iPad, inicie sesión una vez dentro de esa
          aplicación también. Guarda su propia sesión, aparte de Safari.
        </p>
      </>
    )
  },
  {
    question: 'Olvidé mi contraseña. ¿Qué hago?',
    answer: (
      <>
        <p>
          La pantalla para iniciar sesión está en inglés. Escriba su correo en el cuadro <strong>Email</strong> y luego
          toque <strong>Forgot your password?</strong> («¿Olvidó su contraseña?»). Le enviaremos un correo (en inglés)
          con un enlace para crear una contraseña nueva. Si no le llega en unos minutos, revise su carpeta de correo no
          deseado (spam).
        </p>
        <Screenshot
          src="/faq/forgot-password.webp"
          alt="El cuadro para iniciar sesión con un correo escrito y Forgot your password? marcado"
          width={756}
          height={880}
        />
        <p>
          Si se registró con <strong>Continue with Google</strong>, no tiene una contraseña aparte para Bible Reading
          Plan. Solo toque Continue with Google.
        </p>
      </>
    )
  },
  {
    question: '¿Puedo cambiar el idioma?',
    answer: (
      <p>
        El idioma se elige una sola vez, al crear su plan. Para usar la aplicación en inglés, tendría que tocar{' '}
        <strong>Empezar de nuevo</strong> y elegir English, y eso borra su progreso. Para cambiar solo de traducción,
        use Cambiar plan.
      </p>
    )
  }
]

export function FaqPage() {
  const { user } = useAuth()
  const t = useT()
  const questions = useLanguage() === 'es' ? QUESTIONS_ES : QUESTIONS

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-4 py-8 dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-lg">
        <Link
          to={user ? '/dashboard' : '/'}
          className="text-base text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          &larr; {t('common.back')}
        </Link>

        <header className="mt-6 text-center">
          <LogoBadge className="mb-5" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{t('faq.title')}</h1>
        </header>

        <div className="mt-8 space-y-6">
          {questions.map(({ question, answer }) => (
            <section key={question} className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{question}</h2>
              <div className="mt-3 space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">{answer}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
