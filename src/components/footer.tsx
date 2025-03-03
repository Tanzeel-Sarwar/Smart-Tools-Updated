import React from 'react'

const Footer = () => {
    return (
        <footer className="lg:py-5 py-4 lg:text-[17px] text-sm text-center bg-gray-800 text-white mt-auto">
            © {new Date().getFullYear()} Smart Tools Developed By <span className='bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent'>Tanzeel Sarwar</span>. 
            All rights reserved.
        </footer>
    )
}

export default Footer;