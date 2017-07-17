//---------------------------------------------------------------------------------------------
//	Axis 3D Engine Copyright (C) 2017 Palitri
//
//	This software is released under the MIT License http://palitri.com/axis/license/
//
//	For help and documentation, visit http://palitri.com
//---------------------------------------------------------------------------------------------

#include "vld\vld.h"

#include "Media\Sound\OGGVorbis\AxOGGVorbisSoundMediaDispatcher.h"

extern "C"
{

	__declspec(dllexport) unsigned int AxGetSignature()
	{
		return Axis::VersionSignature;
	}

	__declspec(dllexport) void *AxCreateDispatcher(int index)
	{
		switch (index)
		{
			case 0:
			{
				return new AxOGGVorbisSoundMediaDispatcher();
			}
		}

		return 0;
	}

}