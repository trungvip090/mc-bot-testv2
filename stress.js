const mineflayer = require('mineflayer')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function ask(q) {
  return new Promise(res => rl.question(q, ans => res(ans)))
}

function randomName() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let name = ''
  const len = 8 + Math.floor(Math.random() * 5)
  for (let i = 0; i < len; i++) {
    name += chars[Math.floor(Math.random() * chars.length)]
  }
  return name
}

function randomPass() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let p = ''
  for (let i = 0; i < 10; i++) {
    p += chars[Math.floor(Math.random() * chars.length)]
  }
  return p
}

async function start() {
  const host = await ask('IP server: ')
  const port = parseInt(await ask('Port: '))
  const count = parseInt(await ask('Số player: '))
  const delay = parseInt(await ask('Delay (ms): '))

  console.log('\nStarting test...\n')

  const passwords = new Map()

  function create(i) {
    const username = randomName()
    const password = randomPass()

    const bot = mineflayer.createBot({
      host,
      port,
      username
    })

    bot.once('spawn', () => {
      console.log(username + ' joined')

      setTimeout(() => {
        try { bot.chat(`/register ${password} ${password}`) } catch {}
      }, 4000)

      setTimeout(() => {
        try { bot.chat(`/login ${password}`) } catch {}
      }, 8000)

      setTimeout(() => {
        try { bot.chat('test') } catch {}
      }, 12000)
    })

    bot.on('end', () => {
      setTimeout(() => create(i), 20000)
    })

    bot.on('error', () => {})
    bot.on('kicked', () => {})
  }

  for (let i = 0; i < count; i++) {
    setTimeout(() => create(i), i * delay)
  }
}

start()
