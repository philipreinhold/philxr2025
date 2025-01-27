// src/components/pages/Contact.tsx 
import { useState } from 'react'
import PageWrapper from '../Layout/PageWrapper'
import { useLanguageStore } from '../../store/languageStore'
import { translations } from '../../constants/translations'

export default function Contact() {
 const { language } = useLanguageStore()
 const content = translations.contact
 const [formData, setFormData] = useState({
   name: '',
   email: '',
   message: ''
 })

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault()
   try {
     await fetch('https://api.web3forms.com/submit', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         access_key: 'YOUR_WEB3FORMS_KEY',
         ...formData,
         to_email: 'hello@philipreinhold.com'
       })
     })
     setFormData({ name: '', email: '', message: '' })
   } catch (error) {
     console.error('Error:', error)
   }
 }

 const handleWhatsApp = () => {
   const text = encodeURIComponent(`${formData.name}\n${formData.email}\n${formData.message}`)
   window.open(`https://wa.me/YOURNUMBER?text=${text}`, '_blank')
 }

 return (
   <PageWrapper>
     <h2 className="text-xl font-light mb-6">{content.title[language]}</h2>
     <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
       <div>
         <label className="block text-sm mb-2">{content.form.name[language]}</label>
         <input
           type="text"
           value={formData.name}
           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
           className="w-full px-4 py-2 rounded-lg border"
           required
         />
       </div>
       <div>
         <label className="block text-sm mb-2">{content.form.email[language]}</label>
         <input
           type="email"
           value={formData.email}
           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
           className="w-full px-4 py-2 rounded-lg border"
           required
         />
       </div>
       <div>
         <label className="block text-sm mb-2">{content.form.message[language]}</label>
         <textarea
           value={formData.message}
           onChange={(e) => setFormData({ ...formData, message: e.target.value })}
           className="w-full px-4 py-2 rounded-lg border h-32"
           required
         />
       </div>
       <div className="flex gap-4">
         <button
           type="submit"
           className="px-6 py-2 bg-black text-white rounded-lg hover:bg-black/80"
         >
           {content.form.send[language]}
         </button>
         <button
           type="button"
           onClick={handleWhatsApp}
           className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
         >
           {content.form.whatsapp[language]}
         </button>
       </div>
     </form>
   </PageWrapper>
 )
}