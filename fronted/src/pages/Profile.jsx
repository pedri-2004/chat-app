import { IoCameraOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import dp from "../assets/dp.jpg"
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import { serverUrl } from "../main";
import { setUserData } from "../redux/userSlice";
function Profile() {
    let {userData}=useSelector(state=>state.user)
    let dispatch=useDispatch()
    const navigate = useNavigate()
    let [name,setName]=useState(userData.name||"")
    let [frontedImage,setFrontedImage]=useState(userData.image||dp)
    let [backendImage,setBackendImage]=useState(null)
    let [saving,SetSaving]=useState(false)
    let image=useRef()
    const handleImage=(e)=>{
       let file=e.target.files[0]
       setBackendImage(file)
       setFrontedImage(URL.createObjectURL(file)) 
    }
    const handleProfile=async (e)=>{
      e.preventDefault()
      SetSaving(true)
        try {
            let formData=new FormData()
            formData.append("name",name)
            if(backendImage){
                formData.append("image",backendImage)
            }
        let result=await axios.put(`${serverUrl}/api/user/profile`,formData,{withCredentials:true})
            dispatch(setUserData(result.data))
        } catch (error) {
            console.log(error)
      } finally {
            SetSaving(false)
        }
    }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-100 px-4 py-8 text-slate-800 sm:px-6 sm:py-12">
      <section className="mx-auto w-full max-w-2xl">
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Go back"
          className="mb-6 inline-flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-cyan-300 hover:text-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-100"
        >
          <IoIosArrowRoundBack className="text-2xl" />
        </button>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-cyan-900/5">
          <div className="h-32 bg-gradient-to-r from-cyan-500 to-sky-500 sm:h-40" />

          <div className="px-6 pb-8 sm:px-10 sm:pb-10">
            <div className="-mt-14 mb-7 flex items-end justify-between sm:-mt-16">
              <div className="relative size-28 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md sm:size-32 flex-justify-center items-center" onClick={()=>image.current.click()}>
                <img
                  src={frontedImage}
                  alt="Profile"
                  className="size-full object-cover"
                />
              </div>
              <button
                type="button"
                aria-label="Change profile photo"
                className="mb-1 inline-flex size-10 items-center justify-center rounded-full bg-cyan-600 text-white shadow-md transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200"
              >
                <IoCameraOutline className="text-xl" />
              </button>
            </div>

            <div className="mb-7">
              <p className="text-sm font-medium text-cyan-700">Account settings</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Your profile</h1>
              <p className="mt-2 text-sm text-slate-500">Manage the details linked to your account.</p>
            </div>

            <form className="space-y-5" onSubmit={handleProfile}>
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Name</span>
                <input type="file" accept="image/*" ref={image} hidden onChange={handleImage}/>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100" onChange={(e)=>setName(e.target.value)} value={name}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Username</span>
                <input
                  type="text"
                  readOnly
                  value={userData?.userName || ''}
                  className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Email address</span>
                <input
                  type="email"
                  readOnly
                  value={userData?.email || ''}
                  className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                />
              </label>

              <div className="border-t border-slate-100 pt-5">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 sm:w-auto sm:min-w-40 cursor-pointer" disabled={saving}
                >
                  {saving?"saving..":"Save profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Profile;
