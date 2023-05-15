document.addEventListener('DOMContentLoaded', () => {
  const scssEditor = CodeMirror.fromTextArea(document.getElementById('scss-editor'), {
    mode: 'text/x-scss',
    theme: 'material',
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true
  });

  document.getElementById('save-button').addEventListener('click', () => {
    const scssCode = scssEditor.getValue();
    const targetUrl = document.getElementById('url-input').value;

    chrome.storage.local.set({ scssCode, targetUrl }, () => {
      console.log('SCSS code and URL saved.');
    });
  });

  document.getElementById('reset-button').addEventListener('click', () => {
    scssEditor.setValue('');
    document.getElementById('url-input').value = '';
  });

  // Get the stored SCSS code and target URL from local storage
  chrome.storage.local.get(['scssCode', 'targetUrl'], ({ scssCode, targetUrl }) => {
    if (scssCode && targetUrl && new URL(targetUrl).origin === window.location.origin) {
      compileScss(scssCode)
        .then(cssCode => applyCss(cssCode))
        .catch(error => console.error('Error compiling SCSS:', error));
    }
  });
});

async function compileScss(scssCode) {
  const { compile } = await Sass.instantiate();
  const result = compile(scssCode);
  if (result.status === 0) {
    return result.text;
  } else {
    throw new Error(result.formatted);
  }
}

function applyCss(cssCode) {
  const styleElement = document.createElement('style');
  styleElement.textContent = cssCode;
  document.head.appendChild(styleElement);
}


// document.addEventListener('DOMContentLoaded', function () {
//   const scssEditor = CodeMirror.fromTextArea(document.getElementById('scss-editor'), {
//     mode: 'text/x-scss',
//     theme: 'material',
//     lineNumbers: true,
//     autoCloseBrackets: true,
//     matchBrackets: true
//   });

//   document.getElementById('save-button').addEventListener('click', function () {
//     const scssCode = scssEditor.getValue();
//     const targetUrl = document.getElementById('url-input').value;

//     chrome.storage.local.set({ scssCode: scssCode, targetUrl: targetUrl }, function () {
//       console.log('SCSS-code en URL opgeslagen.');
//     });
//   });

//   document.getElementById('reset-button').addEventListener('click', function () {
//     scssEditor.setValue('');
//     document.getElementById('url-input').value = '';
//   });
// });
