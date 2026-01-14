import vine from '@vinejs/vine'

export const rollNumberValidator = vine.compile(
        vine.object({
            rollNo: vine.string().trim()
            .regex(/^[0-9]{2}[A-Z]{3}[0-9]{4}$/)
        })
)