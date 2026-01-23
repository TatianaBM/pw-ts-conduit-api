import dotenv from 'dotenv'

export function loadEnv() {
    dotenv.config({ path: '.env'})
    // ?? returns process.env.ENV if it is not null or not undefined
    const env = process.env.ENV ?? 'local'
    dotenv.config({ path: `.env.${env}`, override: true })
}