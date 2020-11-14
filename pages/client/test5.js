const isClient = typeof window !== 'undefined';

const Test5 = () => isClient ? (
  <>
    <h1 id="target-elem">Client Test 5</h1>
    <p>navigator.standalone: <br /> <code>{String(navigator.standalone)}</code></p>
    <p>createEvent: <code> <br /> {String(document.createEvent)}</code></p>
    <p>target-elem recieve event with type: <code id="target-code"></code></p>
    <div>
      <button onClick={() => {
        const event = document.createEvent('Event');
        event.initEvent('foo', true, true)
        const elem = document.getElementById('target-elem');
        if (elem) {
          elem.addEventListener('foo', (event) => {
            console.log(event);
            const outputElem = document.getElementById('target-code');
            if (outputElem) {
              outputElem.innerText = event.type;
            }
          })
          elem.dispatchEvent(event);
        }
      }}>
        Click me to create event
      </button>
    </div>
    <br />
    <div>
      <button
        onClick={() => {
          throw new Error('Client Test 5')
        }}
      >
        Click me to throw an Error
      </button>
    </div>
  </>
) : null;

export default Test5
