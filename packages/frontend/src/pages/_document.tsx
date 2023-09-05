import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/manifest.json" />
        <title>Skade - знакомства для осознанных, состоятельных мужчин и честных девушек</title>
        <meta name="yandex-verification" content="400343582cd21f45" />
      </Head>
      <body>
        <noscript>
          <div style={{ textAlign: 'center' }}>
            Для полной функциональности этого сайта необходимо включить JavaScript.
            <a
              href="https://www.enable-javascript.com/ru/"
              style={{ color: 'blue', display: 'block', textDecoration: 'underline' }}
            >
              Вот инструкции, как включить JavaScript в вашем браузере
            </a>
            .
          </div>
        </noscript>
        <Main />
        <NextScript />
      </body>
      <div id="myportal" />
    </Html>
  )
}
