const mineflayer = require('mineflayer')

const HOST = 'nova.pikamc.vn'
const PORT = 25010

const TOTAL_BOTS = 100
const JOIN_DELAY = 100
const RECONNECT_DELAY = 1000

const passwords = new Map()

const messages = ['hello', 'hi', 'test', 'ok', 'lag?', 'spawn']

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomPassword(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let p = ''
  for (let i = 0; i < length; i++) {
    p += chars[Math.floor(Math.random() * chars.length)]
  }
  return p
}

function createBot(id) {
  const username = `Bot${id}`

  if (!passwords.has(username)) {
    passwords.set(username, randomPassword())
  }

  const password = passwords.get(username)

  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username
  })

  bot.once('spawn', () => {
    console.log(username + ' joined')

    // register/login
    setTimeout(() => {
      try { bot.chat(`/register ${password} ${password}`) } catch {}
    }, 3000)

    setTimeout(() => {
      try { bot.chat(`/login ${password}`) } catch {}
    }, 6000)

    // chat nhẹ (giảm tải)
    setInterval(() => {
      try {
        bot.chat(rand(messages))
      } catch {}
    }, 30000)
  })

  bot.on('end', () => {
    setTimeout(() => createBot(id), RECONNECT_DELAY)
  })

  bot.on('error', () => {})
  bot.on('kicked', () => {})
}

for (let i = 0; i < TOTAL_BOTS; i++) {
  setTimeout(() => {
    createBot(i)
  }, i * JOIN_DELAY)
}
