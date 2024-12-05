import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;

export interface Access {
  types: string[];
  roles: string[];
  userIds: string[];
  actions: {
    view?: string[];
    edit?: string[];
    upload?: string[];
  };
}

export const fetchRoles = async (): Promise<{ [key: string]: Access } | undefined> => {
  try {
    const response = await axios.get(`${baseUrl}roles`);
    const pagesAccess: { [key: string]: Access } = response.data;
    //console.log('Fetched Pages Access:', pagesAccess);
    return pagesAccess;
  } catch (error) {
    console.error('Error fetching roles:', error);
    return undefined;
  }
};