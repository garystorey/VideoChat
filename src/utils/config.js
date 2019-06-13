/* global _spPageContextInfo */

export const ENV = process.env.NODE_ENV || 'development';

export default {
    API_KEY: '46069882',
    CHROME_EXTENSION_ID: 'allfaakoejbidfdaacokggabefgnkpmm'
};

/* API Urls */
export const baseUrl = (ENV === 'production') ? _spPageContextInfo.webAbsoluteUrl + "/{{STOREID}}/_api/web/lists/getbytitle" : "//localhost/{{STOREID}}";
export const reportUrl = (ENV === 'production') ? _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getbytitle('Store Reports')/Items?$expand=File/Properties" : "../data/store-reports.json";
export const documentUrl = (ENV === 'production') ? _spPageContextInfo.webAbsoluteUrl + "/{{STOREID}}/_api/web/lists/getbytitle('Documents')/Items?$expand=File" : "../data/store-documents.json";
export const notesUrl = (ENV === 'production') ? _spPageContextInfo.webAbsoluteUrl + "/{{STOREID}}/_api/web/lists/getbytitle('Notes')/Items" : "../data/store-notes.json";
export const myRoomsUrl = (ENV === 'production') ? _spPageContextInfo.webAbsoluteUrl + "/_api/web/webs?$top=1000&$filter=effectivebasepermissions/high%20gt%2032" : "../data/myrooms.json";
export const allRoomsUrl = (ENV === 'production') ? _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('StoreDirectory')/Items?$top=1000" : "../data/allrooms.json";
export const userUrl = (ENV === 'production') ? _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid" : "../data/store-user-data.json";
export const photosUrl = (ENV ==='production')?  _spPageContextInfo.webAbsoluteUrl + "/{{STOREID}}/_api/web/lists/getbytitle('Images')/Items?$expand=File" : "../data/store-photos.json";
