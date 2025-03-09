import * as React from 'react'
import { render } from "@react-email/components";
import { transporter } from '../config/transporter';
import MagicLink from '../mail/MagicLink';
import Welcome from '../mail/Welcome';
import { z } from 'zod';

const PostSchema = z.object({
    to: z.string({
        required_error: 'email address to send mail to is required'
    })
        .email()
});

const sendWelcomeMailTo = async (to: string = 'test@example.com') => {
    const html = await render(<Welcome />)

    await transporter.sendMail({
        from: 'noreply@mailhero.com',
        to: to,
        subject: 'Welcome to my newsletter !',
        html,
    })
}

const sendMagicLink = async (to: string = 'test@example.com') => {
    const html = await render(<MagicLink />)

    await transporter.sendMail({
        from: 'noreply@mailhero.com',
        to: to,
        subject: 'Here\'s your magic link',
        html,
    })
}

export const mailRoutes = {
    "/mail/welcome": {
        GET: async () => {
            console.log('GET /mail/welcome');
            await sendWelcomeMailTo();
            return Response.json({ sent: true }, { status: 200 });
        },
        POST: async (req: any) => {
            console.log('POST /mail/welcome');
            const body = await req.json();

            try {
                const validatedBody = PostSchema.parse(body);
                await sendWelcomeMailTo(validatedBody.to);
                return Response.json({ sent: true }, { status: 200 });
            } catch (err) {
                if (err instanceof z.ZodError) {
                    console.log(err.issues);
                    return Response.json({ error: "Bad Request", issues: err.issues }, { status: 400 });
                }
            }
        }
    },
    "/mail/magiclink": {
        GET: async () => {
            console.log('GET /mail/magiclink');
            await sendMagicLink();
            return Response.json({ sent: true });
        },
        POST: async (req: any) => {
            console.log('POST /mail/magiclink');
            const body = await req.json();

            try {
                const validatedBody = PostSchema.parse(body);
                await sendMagicLink(validatedBody.to);
                return Response.json({ sent: true }, { status: 200 });
            } catch (err) {
                if (err instanceof z.ZodError) {
                    console.log(err.issues);
                    return Response.json({ error: "Bad Request", issues: err.issues }, { status: 400 });
                }
            }
        }
    }
};