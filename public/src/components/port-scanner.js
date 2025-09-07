globalThis.LOAD['components/port-scanner'].resolve(async function ({ load }) {
 const library = await load('library')
 const portScanner = await load('modules/port-scanner/index')

 return function createPortScanner({ components, getMenu }) {
  const container = document.createElement('div')
  const form = document.createElement('form')
  const results = document.createElement('div')

  // Styles
  const styles = library.className(
   'port-scanner',
   `
   & {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
   }
   & input {
    padding: 8px;
    margin: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
   }
   & button {
    padding: 8px 16px;
    background: #404040;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
   }
   & button:hover {
    background: #505050;
   }
   & .results {
    margin-top: 20px;
    font-family: monospace;
   }
   & .progress {
    margin-top: 10px;
    color: #888;
   }
   `
  )

  // Create form elements
  const formHtml = `
   <div>
    <label>Start IP:
     <input type="text" id="startIp" value="192.168.1.0" pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$">
    </label>
   </div>
   <div>
    <label>End IP:
     <input type="text" id="endIp" value="192.168.1.255" pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$">
    </label>
   </div>
   <div>
    <label>Start Port:
     <input type="number" id="startPort" value="1500" min="1" max="65535">
    </label>
   </div>
   <div>
    <label>End Port:
     <input type="number" id="endPort" value="5500" min="1" max="65535">
    </label>
   </div>
   <button type="submit">Start Scan</button>
  `

  form.innerHTML = formHtml
  results.classList.add('results')

  // Handle form submission
  form.onsubmit = async (e) => {
   e.preventDefault()

   const startIp = form.querySelector('#startIp').value
   const endIp = form.querySelector('#endIp').value
   const startPort = parseInt(form.querySelector('#startPort').value)
   const endPort = parseInt(form.querySelector('#endPort').value)

   results.innerHTML = '<div>Scanning...</div>'
   const progressDiv = document.createElement('div')
   progressDiv.classList.add('progress')
   results.appendChild(progressDiv)

   try {
    const foundPorts = await portScanner.scanRange(
     startIp,
     endIp,
     startPort,
     endPort,
     (progress) => {
      progressDiv.textContent = `Scanning ${progress.currentIp}:${progress.currentPort} - Found: ${progress.found}`
     }
    )

    results.innerHTML = '<h3>Results:</h3>'
    if (foundPorts.length === 0) {
     results.innerHTML += '<div>No open ports found</div>'
    } else {
     const list = document.createElement('ul')
     foundPorts.forEach(({ ip, port }) => {
      const item = document.createElement('li')
      item.textContent = `${ip}:${port}`
      list.appendChild(item)
     })
     results.appendChild(list)
    }
   } catch (error) {
    results.innerHTML = `<div style="color: red">Error: ${error.message}</div>`
   }
  }

  container.appendChild(form)
  container.appendChild(results)
  styles.apply(container)

  return {
   element: container,
  }
 }
})
