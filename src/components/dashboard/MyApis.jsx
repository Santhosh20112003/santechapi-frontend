import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../common/links';
import { useUserAuth } from '../context/UserAuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import nokeyImage from '../assert/No data-pana.svg';
import nosubsImage from '../assert/Subscriber-bro.svg';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Dialog from '@radix-ui/react-dialog';

function Apis() {
  const { user } = useUserAuth();
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscribedApis, setSubscribedApis] = useState([]);
  const [subscribedApisLoading, setSubscribedApisLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setSubscribedApisLoading(true);

      try {
        const apiKeysResponse = await axios.get(`https://santechapiback.vercel.app/getapiKeys`, {
          body: { 'email': user.email },
          headers:{'Content-Type':'application/json'}
        });

        const subscribedApisResponse = await axios.get(`https://santechapiback.vercel.app/getsubscribedapis`, {
          body: { 'email': user.email },
          headers:{'Content-Type':'application/json'}
        });

        if (apiKeysResponse.status === 200) {
          const updatedApiKeys = apiKeysResponse.data.map((token) => ({
            key: token,
            copied: false
          }));
          setApiKeys(updatedApiKeys);
        }

        setSubscribedApis(subscribedApisResponse.data);
      } catch (error) {
        console.error(error);
      } finally {
        console.log(apiKeys)
        setLoading(false);
        setSubscribedApisLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const copyToClipboard = (token, index) => {
    navigator.clipboard.writeText(token);
    const updatedApiKeys = apiKeys.map((key, i) => ({
      ...key,
      copied: i === index
    }));
    setApiKeys(updatedApiKeys);

    toast.success('API Key is Copied', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    setTimeout(() => {
      setApiKeys(apiKeys.map(key => ({ ...key, copied: false })));
    }, 5000);
  };

  const deleteApiKey = async (token, index) => {
    try {
      const result = await axios.delete(`${baseUrl}/deleteapiKeys/${token}`, {
        headers: { 'token': user.accessToken }
      });
      if (result.status === 200) {
        toast.error('API Key Deleted Successfully', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setApiKeys(apiKeys.filter((_, i) => i !== index));
      }
    } catch (error) {
      toast.error(`Error Occurred with ${error}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const createApiKey = async () => {
    setLoading(true);

    try {
      const result = await axios.get(`${baseUrl}/createapikey`, {
        headers: { 'token': user.accessToken }
      });
      if (result.status === 200) {
        toast.success('API Key Created Successfully', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
      setApiKeys([...apiKeys, {'key':result.data.token,"copied":false}]);
      
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async(api,index) =>{
    setLoading(true);

    try {
      const result = await axios.get(`${baseUrl}/removeSubscribeApi/${api.name}`, {
        headers: { 'token': user.accessToken }
      });

      if (result.status === 200) {
        toast.info(`${api.name} Api unsubscribed Successfully`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setSubscribedApis(subscribedApis.filter((_, i) => i !== index));
      }
      
      
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }

  const handleApiError = (error) => {
    if (error.response) {
      if (error.response.status === 400) {
        toast.error(`Error Occurred with ${error.response.data}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (error.response.status === 403) {
        toast.warning("API Key limit is reached!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } else {
      toast.error(`Error Occurred with ${error}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div className="h-[90vh] overflow-y-scroll">
      <h1 className="text-2xl ms-5 mt-5 font-semibold text-gray-700"><i className="fas fa-user"></i> My Space</h1>

      {loading ? (
        <div className="rounded-md p-5 mx-5 mt-5 flex items-center justify-center bg-violet-200 border-2 border-violet-300">
          <svg className={`animate-spin h-8 w-8 text-violet-500`} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="rounded-md p-5 mx-5 mt-5 bg-violet-200 border-2 border-violet-300">
          <span className="flex items-center flex-wrap justify-between">
            <h1 className="text-lg ms-3 text-violet-800">API KEYS</h1>
            <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button onClick={createApiKey} className="text-white fas fa-plus  shadow-blackA4 hover:bg-violet-500 inline-flex h-[35px] w-[35px] items-center justify-center rounded-full bg-violet-600 shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black">
          
          </button>
          
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-md will-change-[transform,opacity]"
            sideOffset={5}
          >
            Add ApiKey
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
          </span>

          {apiKeys.length > 0 ? (
            <ul className="flex mt-5  flex-col gap-3">
              {apiKeys.map((token, index) => (
                <li
                  key={index}
                  className={`flex w-full items-center rounded-md justify-end md:justify-between md:flex-nowrap flex-wrap gap-3 px-3 py-2 bg-gray-700`}
                >
                  <p className={`text-sm w-fit break-all ${token.copied ? 'text-white' : 'text-white'}`}>
                    {token.key}
                  </p>
                  <i
                    className={`px-3 py-2 border-2 fas ${token.copied ? 'fa-check' : 'fa-clipboard'} ${token.copied ? 'bg-green-200 border-green-400' : 'bg-gray-200 border-gray-400'} text-gray-500 rounded-md`}
                    onClick={() => copyToClipboard(token.key, index)}
                  ></i>
                   <AlertDialog.Root >
    <AlertDialog.Trigger asChild>
      <button className="fas fa-trash bg-red-200 border-2 px-3 py-2 border-red-400 text-red-500 rounded-md">
      </button>
    </AlertDialog.Trigger>
    <AlertDialog.Portal >
      <AlertDialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
      <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] z-50 rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
          Are you absolutely sure?
        </AlertDialog.Title>
        <AlertDialog.Description className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
          This action cannot be undone. This will permanently delete your Api Key from our servers.
        </AlertDialog.Description>
        <div className="flex justify-end gap-[25px]">
          <AlertDialog.Cancel asChild>
            <button className="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
              Cancel
            </button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <button onClick={() => deleteApiKey(token.key, index)} className="text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
              Yes, delete 
            </button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
                   </AlertDialog.Root>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center mt-5 justify-center flex-col">
              <img src={nokeyImage} alt="NO API KEY" className="w-44" />
              <p className="text-base">Not Yet Created Anything...</p>
            </div>
          )}
        </div>
      )}

      <ToastContainer />

      <h1 className="text-2xl ms-5 mt-10 font-semibold text-gray-700">Subscribed APIs</h1>

      <span id="subscribed" className="">
        {subscribedApisLoading ? (
          <div className="mx-10 flex items-center justify-center mt-5 h-40 bg-cover pb-4" >
            <svg className={`animate-spin h-8 w-8 text-violet-500`} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          subscribedApis.length > 0 ? (
            <div className="">
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-3" >
                {subscribedApis.map((api, index) => (
                  <div key={index} className="p-4 flex items-center justify-center md:block">
                    <div className={`lg:h-64 h-80 w-[1fr] max-w-[500px]  bg-gray-500 relative rounded-lg overflow-hidden shadow-lg`}>
                      <span className="bg-emerald-500 z-10 text-white px-3 py-1 text-xs absolute right-0 top-0 rounded-bl">Subscribed</span>
                      <img src={api.img} alt="" className="w-full h-full object-fill relative brightness-50" />
                      <span className="absolute left-[10%] text-gray-50 bottom-[10%] pb-3">
                        <h1 className="sm:text-2xl inline-flex items-center pe-3 gap-2 text-xl font-semibold mb-3">{api.name} <a href={api.link} className="inline-flex text-sm items-center mt-1.5 fas fa-arrow-up-right-from-square"></a> </h1>
                        <p className="leading-relaxed text-gray-200 mb-5">{api.short_desc}</p>
                        
                        <AlertDialog.Root >
    <AlertDialog.Trigger asChild>
    <button  className='px-3 py-2 rounded-md bg-red-500 text-white '>Un Subscribe</button>
    </AlertDialog.Trigger>
    <AlertDialog.Portal >
      <AlertDialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
      <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] z-50 rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
          Are you absolutely sure?
        </AlertDialog.Title>
        <AlertDialog.Description className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
          This action cannot be undone. This will permanently delete your Api Key from our servers.
        </AlertDialog.Description>
        <div className="flex justify-end gap-[25px]">
          <AlertDialog.Cancel asChild>
            <button className="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
              Cancel
            </button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <button onClick={()=>{unsubscribe(api,index)}} className="text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
              Unsubscribe
            </button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
                   </AlertDialog.Root>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center py-5 my-5 justify-center flex-col">
              <img src={nosubsImage} alt="NO API KEY" className="w-44" />
              <p className="text-base">Not Yet Subscribed Anything...</p>
            </div>
          )
        )}
      </span>
    </div>
  );
}

export default Apis;
