// app/types/context.d.ts
import { AppSession } from '~/lib/session';

declare global {
    interface HydrogenAdditionalContext {
        // Define the shape of your extra context here
        // session: AppSession; 
    }
}

export { }; //treated as a module