import React from "react";
import logo from "../assert/mockup-api.png";
import Code from "./code";
import CodeSnippet from "./CodeSnippet";
import Contact from "./contact";
import Footer from "./footer";
import Header from "./header";
import Hero from "./hero";
import List from "./list";
import Notificationbanner from "./notificationbanner";
import Pricing from "./pricing";
import Steps from "./steps";
import Testimonials from "./testimonials";


function App() {
  return (
    <div className="bg-[url(https://ik.imagekit.io/iete/assets/back.png)] bg-contain">
    <Notificationbanner/>
    <Header/>
    <Hero/>
    <CodeSnippet/>
    
    <Code/>
    <List/>
    <Steps/>
    <Testimonials/>
    <Pricing/>
    <Contact/>
    <Footer/>
    </ div>
  );
}

export default App;
