globalThis.LOAD['modules/port-scanner/index'].resolve(async function () {
 const portScanner = {
  isScanning: false,

  async scanPort(ip, port, timeout = 1000) {
   if (!this.isScanning) {
    throw new Error('SCAN_CANCELLED')
   }

   try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(`http://${ip}:${port}`, {
     mode: 'no-cors',
     signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return true
   } catch (error) {
    if (!this.isScanning) {
     throw new Error('SCAN_CANCELLED')
    }
    return false
   }
  },

  async scanRange(startIp, endIp, startPort, endPort, progressCallback) {
   this.isScanning = true
   const results = []

   try {
    const start = ipToNumber(startIp)
    const end = ipToNumber(endIp)

    for (let ip = start; ip <= end && this.isScanning; ip++) {
     const currentIp = numberToIp(ip)

     for (let port = startPort; port <= endPort && this.isScanning; port++) {
      try {
       const isOpen = await this.scanPort(currentIp, port)
       if (isOpen && this.isScanning) {
        results.push({ ip: currentIp, port })
       }
      } catch (error) {
       if (error.message === 'SCAN_CANCELLED') {
        throw error
       }
      }

      if (progressCallback && this.isScanning) {
       progressCallback({
        currentIp,
        currentPort: port,
        found: results.length,
       })
      }
     }
    }

    return results
   } finally {
    this.isScanning = false
   }
  },

  cancelScan() {
   this.isScanning = false
  },
 }

 function ipToNumber(ip) {
  return (
   ip.split('.').reduce((total, part) => (total << 8) + parseInt(part), 0) >>> 0
  )
 }

 function numberToIp(num) {
  return [
   (num >>> 24) & 0xff,
   (num >>> 16) & 0xff,
   (num >>> 8) & 0xff,
   num & 0xff,
  ].join('.')
 }

 return portScanner
})
