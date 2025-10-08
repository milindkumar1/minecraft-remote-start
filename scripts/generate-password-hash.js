const bcrypt = require('bcryptjs')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Enter password to hash: ', async (password) => {
  try {
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    console.log('\nGenerated hash:')
    console.log(hash)
    console.log('\nAdd this to your .env.local file as AUTH_PASSWORD_HASH')
  } catch (error) {
    console.error('Error generating hash:', error)
  } finally {
    rl.close()
  }
})
