import "./globals.css";
import Navbar from "./components/Navbar/index";
import Footer from "./components/Footer/Footer";
import "react-datepicker/dist/react-datepicker.css";
import MyToastContainer from "./components/MyToastContainer";

export const metadata = {
  title: "NebulaCare",
  description: "Psychiatrist Booking System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
        <MyToastContainer />
      </body>
    </html>
  );
}
