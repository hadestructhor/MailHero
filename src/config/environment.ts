import { z } from "zod";
import * as process from "process";

const EnvSchema = z.object({
    NODE_ENV: z.enum(
        [
            'development',
            'production'
        ]
    ).default('development')
});

export const ProdEnvSchema = z.object({
    NODE_ENV: z.enum(
        [
        'production',
        ]
    ).default('production'),
    MAIL_PORT: z.coerce
        .number({
        description: 'Mail server \'s port used to send emails',
        required_error: 'The mail server port is required.',
        })
        .positive()
        .max(65536, `MAIL_PORT should be >= 0 and < 65536`),
    MAIL_HOST: z.string({
      description: 'Mail server hostname or IP address used to send emails',
      required_error: 'The mails server hostname or IP address is required.',
    }),
    MAIL_AUTH_USER: z.string({
      description: 'Username of the email account used to send emails',
      required_error: 'The username is required.',
    }),
    MAIL_AUTH_PASS: z.string({
      description: 'Password of the email account used to send emails',
      required_error: 'The password is required.',
    }),
    MAIL_SECURE: z.enum(["true", "false"]).transform((v) => v === "true")
})

export const DevEnvSchema = z.object({
    NODE_ENV: z.enum(
        [
        'development',
        ]
    ).default('development'),
    MAIL_PORT: z.coerce
        .number({
        description: 'Mail server \'s port used to send emails',
        required_error: 'The mail server port is required.',
        })
        .positive()
        .max(65536, `MAIL_PORT should be >= 0 and < 65536`),
    MAIL_HOST: z.string({
      description: 'Mail server hostname or IP address used to send emails',
      required_error: 'The mails server hostname or IP address is required.',
    })
});

const currentEnv = EnvSchema.parse(process.env);

export const isProduction = currentEnv.NODE_ENV === 'production';