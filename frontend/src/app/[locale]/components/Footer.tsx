import {useTranslations} from "next-intl";

export default function Footer() {
    const t = useTranslations("Footer");

    return (
        <footer className="w-full text-white py-4">
            <div className="container mx-auto text-center">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} Hotelowo. {t("allRightsReserved")}.
                </p>
            </div>
        </footer>
    );
}