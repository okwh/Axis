/****************************** Module Header ******************************\
Module Name:  dllmain.cpp
Project:      sCppShellExtThumbnailHandler
Copyright (c) Microsoft Corporation.

The file implements DllMain, and the DllGetClassObject, DllCanUnloadNow, 
DllRegisterServer, DllUnregisterServer functions that are necessary for a COM 
DLL. 

DllGetClassObject invokes the class factory defined in ClassFactory.h/cpp and 
queries to the specific interface.

DllCanUnloadNow checks if we can unload the component from the memory.

DllRegisterServer registers the COM server and the thumbnail handler in the 
registry by invoking the helper functions defined in Reg.h/cpp. The thumbnail 
handler is associated with the .recipe file class.

DllUnregisterServer unregisters the COM server and the thumbnail handler. 

This source is subject to the Microsoft Public License.
See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
All other rights reserved.

THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, 
EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED 
WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE.
\***************************************************************************/

#include <windows.h>
#include <Guiddef.h>
#include <shlobj.h>                 // For SHChangeNotify
#include "Providers/Scene/AxSceneClassFactory.h"
#include "Providers/Image/AxImageClassFactory.h"
#include "Utils/Reg.h"


HINSTANCE   g_hInst     = NULL;
long        g_cDllRef   = 0;


BOOL APIENTRY DllMain(HMODULE hModule, DWORD dwReason, LPVOID lpReserved)
{
	switch (dwReason)
	{
	case DLL_PROCESS_ATTACH:
        // Hold the instance of this DLL module, we will use it to get the 
        // path of the DLL to register the component.
        g_hInst = hModule;
        DisableThreadLibraryCalls(hModule);
        break;
	case DLL_THREAD_ATTACH:
	case DLL_THREAD_DETACH:
	case DLL_PROCESS_DETACH:
		break;
	}
	return TRUE;
}


//
//   FUNCTION: DllGetClassObject
//
//   PURPOSE: Create the class factory and query to the specific interface.
//
//   PARAMETERS:
//   * rclsid - The CLSID that will associate the correct data and code.
//   * riid - A reference to the identifier of the interface that the caller 
//     is to use to communicate with the class object.
//   * ppv - The address of a pointer variable that receives the interface 
//     pointer requested in riid. Upon successful return, *ppv contains the 
//     requested interface pointer. If an error occurs, the interface pointer 
//     is NULL. 
//
STDAPI DllGetClassObject(REFCLSID rclsid, REFIID riid, void **ppv)
{
    HRESULT hr = CLASS_E_CLASSNOTAVAILABLE;

    if (IsEqualCLSID(AxSceneClassFactory::CLSID_ThumbnailProvider, rclsid))
    {
        hr = E_OUTOFMEMORY;

        AxSceneClassFactory *pClassFactory = new AxSceneClassFactory();
        if (pClassFactory)
        {
            hr = pClassFactory->QueryInterface(riid, ppv);
            pClassFactory->Release();
        }
    }

	if (IsEqualCLSID(AxImageClassFactory::CLSID_ThumbnailProvider, rclsid))
    {
        hr = E_OUTOFMEMORY;

        AxImageClassFactory *pClassFactory = new AxImageClassFactory();
        if (pClassFactory)
        {
            hr = pClassFactory->QueryInterface(riid, ppv);
            pClassFactory->Release();
        }
    }

    return hr;
}


//
//   FUNCTION: DllCanUnloadNow
//
//   PURPOSE: Check if we can unload the component from the memory.
//
//   NOTE: The component can be unloaded from the memory when its reference 
//   count is zero (i.e. nobody is still using the component).
// 
STDAPI DllCanUnloadNow(void)
{
    return g_cDllRef > 0 ? S_FALSE : S_OK;
}


//
//   FUNCTION: DllRegisterServer
//
//   PURPOSE: Register the COM server and the thumbnail handler.
// 
STDAPI DllRegisterServer(void)
{
    HRESULT hr;

    wchar_t szModule[MAX_PATH];
    if (GetModuleFileName(g_hInst, szModule, ARRAYSIZE(szModule)) == 0)
    {
        hr = HRESULT_FROM_WIN32(GetLastError());
        return hr;
    }

    // Register the component.
	// AxScene
	hr = RegisterInprocServer(szModule, AxSceneClassFactory::CLSID_ThumbnailProvider, AxSceneClassFactory::friendlyName, L"Apartment");
    if (SUCCEEDED(hr))
    {
        // Register the thumbnail handler. The thumbnail handler is associated
        // with the .recipe file class.
        hr = RegisterShellExtThumbnailHandler(AxSceneClassFactory::extensionName, AxSceneClassFactory::CLSID_ThumbnailProvider);
        if (SUCCEEDED(hr))
        {
			// AxImage
			hr = RegisterInprocServer(szModule, AxImageClassFactory::CLSID_ThumbnailProvider, AxImageClassFactory::friendlyName, L"Apartment");
			if (SUCCEEDED(hr))
			{
		        hr = RegisterShellExtThumbnailHandler(AxImageClassFactory::extensionName, AxImageClassFactory::CLSID_ThumbnailProvider);
				if (SUCCEEDED(hr))
				{
					// This tells the shell to invalidate the thumbnail cache. It is 
			        // important because any .recipe files viewed before registering 
		            // this handler would otherwise show cached blank thumbnails.
				    SHChangeNotify(SHCNE_ASSOCCHANGED, SHCNF_IDLIST, NULL, NULL);
				}
			}
        }
    }

    return hr;
}


//
//   FUNCTION: DllUnregisterServer
//
//   PURPOSE: Unregister the COM server and the thumbnail handler.
// 
STDAPI DllUnregisterServer(void)
{
    HRESULT hr = S_OK;

    wchar_t szModule[MAX_PATH];
    if (GetModuleFileName(g_hInst, szModule, ARRAYSIZE(szModule)) == 0)
    {
        hr = HRESULT_FROM_WIN32(GetLastError());
        return hr;
    }

    // Unregister the component.
    hr = UnregisterInprocServer(AxSceneClassFactory::CLSID_ThumbnailProvider);
    if (SUCCEEDED(hr))
    {
        // Unregister the thumbnail handler.
        hr = UnregisterShellExtThumbnailHandler(AxSceneClassFactory::extensionName);
	    if (SUCCEEDED(hr))
		{
		    hr = UnregisterInprocServer(AxImageClassFactory::CLSID_ThumbnailProvider);
			if (SUCCEEDED(hr))
			{
		        hr = UnregisterShellExtThumbnailHandler(AxImageClassFactory::extensionName);
			}
		}
    }

    return hr;
}