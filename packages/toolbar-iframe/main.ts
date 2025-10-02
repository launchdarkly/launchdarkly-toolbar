import { type LaunchDarklyToolbarProps } from "@launchdarkly/toolbar";

function mountToolbar(options: LaunchDarklyToolbarProps): HTMLIFrameElement {
  // const html = [
  //   '<head>',
  //   '<meta charset="UTF-8">',
  //   '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
  //   '<title>Developer Toolbar</title>',
  //   '</head>',
  //   '<body>',
  //   '<div id="root"></div>',
  //   '<script crossorigin src="https://unpkg.com/react@19.2.0/cjs/react.production.js"></script>',
  //   '<script crossorigin src="https://unpkg.com/react-dom@19/cjs/react-dom.production.js"></script>',
  //   '<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>',
  //   '<script src="./node_modules/@launchdarkly/toolbar/dist/js/index.js"></script>',
  //   `<script>ReactDom.render(${toolbar})</script>`,
  //   '</body>'
  // ];
  const html = `
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style></style>
    <title>Developer Toolbar</title>
  </head>
  <body>
    <div id="root"></div>
    <script crossorigin src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/babel" src="../../node_modules/@launchdarkly/toolbar/dist/js/index.js"></script>
    <script>
      const { lazy } = require('react');
      const LaunchDarklyToolbar = lazy(() =>
        import('@launchdarkly/toolbar').then((module) => ({ default: module.LaunchDarklyToolbar })),
      );

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<LaunchDarklyToolbar ...${options} />);
    </script>
  </body>
  `;

  const iframe = document.createElement('iframe');
  iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);

  return iframe;
}

export default mountToolbar;