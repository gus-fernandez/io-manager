// @/Pages/About.jsx

/**
 * @file About.jsx
 * @module Pages/About
 * @description Página informativa "About". Presenta la filosofía del proyecto "IO" 
 * y sirve como hub de contacto, utilizando `IconWrapper` para estandarizar 
 * el comportamiento visual de los enlaces sociales.
 */

import { AboutIcons } from "@/Features/Device/Shared/components/Icons";

/**
 * Componente envoltorio para los iconos de navegación.
 * Aplica estilos de hover, foco y transiciones a los enlaces sociales.
 * @param {object} props
 * @param {React.ReactNode} props.children - El elemento icono a renderizar.
 * @param {string} props.href - La URL de destino del enlace.
 * @param {string} props.tt - Texto descriptivo para el atributo title y accesibilidad.
 */
const IconWrapper = ({ children, href, tt }) => (
    <div className="w-14 h-14 block shrink-0 hover:text-neutral-200 transition-all duration-150 cursor-pointer hover:scale-125">
        <a  
            className="block w-full h-full outline-none focus-visible:ring-4 focus-visible:ring-neutral-700 rounded-full"
            title={tt}
            href={href}
            target="blank" 
            rel="noopener noreferrer" 
            aria-label={tt}
        >
        {children}
        </a>
    </div>
);

/**
 * Página "About" (Acerca de).
 * Muestra el contexto y propósito del proyecto "IO", además de proporcionar
 * enlaces de contacto y redes sociales.
 */
export default function About() {
    return (
        <>
        <div className="text-neutral-400 flex w-full justify-center items-center gap-6 py-12 ">
            <IconWrapper tt="Link to Github" href="https://github.com/gus-fernandez/io-manager"><AboutIcons.Github /></IconWrapper>
            <IconWrapper tt="Link to LinkedIn" href="https://www.linkedin.com/in/gusmoai"><AboutIcons.Linkedin /></IconWrapper>
            <IconWrapper tt="Soon" href="https://discord.gg/"><AboutIcons.Discord /></IconWrapper>
            <IconWrapper tt="Soon" href="https://soundcloud.com/"><AboutIcons.Soundcloud /></IconWrapper>
            <IconWrapper tt="Send me a mail" href="mailto:gusfernandez.lfb@gmail.com"><AboutIcons.Mail /></IconWrapper>
            <IconWrapper tt="Soon" href="mailto:gusfernandez.lfb@gmail.com" aria-disabled="true"><AboutIcons.Help /></IconWrapper>
        </div>
        <div className="text-neutral-200 text-xl text-center max-w-[456px] mx-auto items-center">
            <h2 className="py-2">ABOUT:</h2>
            <div className="text-neutral-400 text-sm text-justify border-t border-b border-neutral-900 py-2">
                <p className="indent-6 py-2">
                    The IO family of instruments and, consequently, this App were born from a personal journey through sound, music, and technology. The desire —almost the need— to get to the core of things opened two doors. The first: microcontrollers; the second: subtractive synthesis.
                </p>
                <p className="indent-6 py-2">
                    The purpose of this project is to push the established boundaries of what can be done. To make that breakthrough accessible. To bridge knowledge with play and create tools that bring digital synthesis closer to anyone who might be interested.
                </p>
                <p className="indent-6 py-2">
                    Use IO, record, enjoy, and, if you want, share it.
                </p>
            </div>
        </div>
        </>
    );
}