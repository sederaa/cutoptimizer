import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        colors: {
            dark: string;
            light: string;
            bold: string;
            error: string;
            border: string;
        };
        fonts: {
            heading: string;
            text: string;
        };
    }
}
