import { jwtDecode } from 'jwt-decode';
import { IUser } from './components/AddColleagueInput/AddColleagueInput';

interface IJWTPayload {
	id: number;
	iat: number;
	exp: number;
}

export const isAccessTokenValid = (accessToken: string) => {
	try {
		const data = jwtDecode(accessToken);

		if (!data) {
			return false;
		}
		const isAccessTokenExpired =
			(data as IJWTPayload).exp < Date.now() / 1000;

		if (isAccessTokenExpired) {
			return false;
		}

		return true;
	} catch (err: any) {
		return false;
	}
};

export const clearRefreshToken = () => {
	document.cookie = `refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export const setRefreshToken = (refreshToken: string) => {
	const data = jwtDecode(refreshToken);
	let expirationDate;
	if (data.exp) {
		expirationDate = new Date(data.exp! * 1000); // Convert seconds to milliseconds
	}
	document.cookie = `refreshToken=${refreshToken}; ${
		expirationDate && `expires=${expirationDate.toUTCString()}; `
	}path=/`;
};

export const getRefreshToken = () => {
	return document.cookie.split('; ')[0].split('=')[1];
};

export const generateImgUrl = (imageBinary: string) => {
	return `data:image/png;base64,${imageBinary}`;
};

export const filterUniqueUserIds = (array: IUser[]) => {
	const uniqueIdsSet = new Set();
	const resultArray = [];
  
	for (const obj of array) {
	  if (!uniqueIdsSet.has(obj.id)) {
		// If the ID is not in the Set, add the object to the result array
		// and add the ID to the Set.
		resultArray.push(obj);
		uniqueIdsSet.add(obj.id);
	  }
	  // If the ID is already in the Set, skip the object.
	}
  
	return resultArray;
  }