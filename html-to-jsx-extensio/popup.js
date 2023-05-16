import parse from 'html-react-parser';

document.getElementById('convertButton').addEventListener('click', () => {
  const htmlInput = document.getElementById('htmlInput').value;
  const jsxOutput = convertHtmlToJsx(htmlInput);
  document.getElementById('jsxOutput').value = jsxOutput;
});

function convertHtmlToJsx(html) {
  const reactElement = parse(html);
  const jsx = serializeReactElement(reactElement);
  return jsx;
}

function serializeReactElement(reactElement) {
  if (typeof reactElement === 'string') {
    return reactElement;
  }

  if (Array.isArray(reactElement)) {
    return reactElement.map(serializeReactElement).join('');
  }

  const type = reactElement.type;
  const props = reactElement.props;
  const children = props.children;

  let serializedProps = '';

  for (const key in props) {
    if (key !== 'children') {
      const propValue = typeof props[key] === 'string' ? `"${props[key]}"` : `{${JSON.stringify(props[key])}}`;
      serializedProps += ` ${key}=${propValue}`;
    }
  }

  if (children) {
    const serializedChildren = serializeReactElement(children);
    return `<${type}${serializedProps}>${serializedChildren}</${type}>`;
  } else {
    return `<${type}${serializedProps} />`;
  }
}
