/* global _spPageContextInfo */

import { myRoomsUrl, allRoomsUrl, userUrl } from "./config";

export const queryRooms = () => fetchJSON(myRoomsUrl, fetchBaseSettings, (data) => {
    return getStoreDetails(data);
});

export const querySharepoint = (url) => fetchJSON(url, fetchBaseSettings, reSort);

const fetchBaseSettings = {
    method: "GET", credentials: "same-origin", // or credentials: 'include'
    headers: {
        Accept: "application/json; odata=verbose"
    }
};

const fetchDigest = () => {
    const contextInfoURL = _spPageContextInfo.webAbsoluteUrl + '/_api/contextinfo';
    const fetchSettings = {
        method: "POST",
        credentials: "same-origin",
        headers: {
            Accept: "application/json; odata=verbose"
        }
    };
    return fetchJSON(contextInfoURL, fetchSettings, (data) => data.d.GetContextWebInformation.FormDigestValue);
};

const spResultObject = {d:{results:[]}};

const reSort = (data) => {
    const arr = data.d.results;
    if (!arr.length) return [];
    return arr.sort( (a,b) => {
        a = new Date(a.Modified);
        b = new Date(b.Modified);
        return (a>b)?-1:(a<b)?1:0;
    });
};

const properCase = (s) => s.toLowerCase().replace(/^(.)|\s(.)/g, ($1) => $1.toUpperCase());

const fetchJSON = (url, settings, cb) => {
    return fetch(new Request(url, settings))
        .then(response => response.json())
        .then(data => {
            const spObj = spResultObject;
            return cb(Object.assign(spObj, data)); // make sure .d.results always exists
        });
};

const fetchBasic = (url,settings) => {
    return fetch(new Request(url, settings))
        .then(response => response)
};

const getStoreDetails = (data) => {
    const myStores = data.d.results.map(mapMyStoreData);
    return roomDetails(allRoomsUrl).then( (allStoreData) => {
        allStoreData = allStoreData.map(mapStoreData);
        return myStores.map( (s) => {
            const storeData = allStoreData.filter( (store) => store.storeId === s.storeId);
            const firstStore = (storeData.length) ? storeData.shift() : {};
            return {
                ...s,
                ...firstStore
            }
        });
    });
};

const mapMyStoreData = (s) => {
    let { ServerRelativeUrl,Description,Title } = s;
    return {
        storeId: Title,
        ServerRelativeUrl,
        Description: properCase(Description)
    };
};

const mapStoreData = (s) => {
    let { Id,Concepts,Manager1Name,Manager1Position,store,Name1,
        MondayHours,TuesdayHours,WednesdayHours, ThursdayHours,FridayHours,SaturdayHours,SundayHours,
        phone1,RD,address1,address2,city,state,zip,district,opendate,Type1 } = s;

    Manager1Position = Manager1Position || 'Store Manager';
    Concepts = Concepts || '';  Manager1Name = Manager1Name || '';
    Name1 = Name1 || '';  state = state || '';   address1 = address1 || '';
    address2 = address2 || '';  city = city || '';  zip = zip || '';
    opendate = opendate || '';  Type1 = Type1 || ''; MondayHours = MondayHours || '';
    TuesdayHours = TuesdayHours || '';   WednesdayHours = WednesdayHours || '';
    ThursdayHours = ThursdayHours || '';    FridayHours = FridayHours || '';
    SaturdayHours = SaturdayHours || '';   SundayHours = SundayHours || '';
    Name1 = properCase(Name1);
    Manager1Name = properCase(Manager1Name);

    return {
        Id,Concepts,Manager1Name,Manager1Position,store,Name1,
        MondayHours,TuesdayHours,WednesdayHours, ThursdayHours,FridayHours,SaturdayHours,SundayHours,
        phone1,RD,address1,address2,city,state,zip,district,opendate,Type1,
        storeId:`${store}`
    };
};

const roomDetails = () => fetchJSON(allRoomsUrl, fetchBaseSettings, (data) => data.d.results);

const getListItem = (uri) => {
    const fetchSettings = {
        method: 'GET',
        credentials: 'include',
        headers:{
            'Accept': 'application/json; odata=verbose'
        }
    };
    return fetchJSON(uri, fetchSettings, (r) => r);
};

export const getUserInfo = (id) => {
    const url = (!id) ? userUrl : `${userUrl}('${id}')`;
    return fetchJSON(url, fetchBaseSettings, response => response);
};

export const addFile = (file, fileType, method, storeId) => {
    const fileCollectionEndpoint = String.format(
        '{0}/{1}/_api/web/GetFolderByServerRelativeUrl(\'{2}\')/files' +
        '/add(overwrite=true, url=\'{3}\')',
        _spPageContextInfo.webAbsoluteUrl, storeId, fileType, file.name);

    return fetchDigest().then((digest) => {
        const fetchSettings = {
            method: method,
            credentials: 'include',
            body: file,
            headers: new Headers({
                'X-RequestDigest': digest,
                'content-type': 'multipart/form-data',
                'Accept': 'application/json; odata=verbose'
            })
        };
        // This call returns the SharePoint file.
        return fetchJSON(fileCollectionEndpoint, fetchSettings, (file) => {
            return getListItem(file.d.ListItemAllFields.__deferred.uri);
        });
    });
};

export const addEditNote = (id, title, noteBody, notesEditUrl) => {
    return fetchDigest().then((digest) => {
        let url = notesEditUrl,
            headers = new Headers({
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
                'X-RequestDigest': digest
            });

        if (id !== null) {
            url = notesEditUrl + '('+ id +')';
            headers = new Headers({
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
                'X-RequestDigest': digest,
                "IF-MATCH": "*",
                "X-HTTP-Method":"MERGE"
            })
        }

        const fetchSettings = {
            method: 'POST',
            body: JSON.stringify ({
                __metadata: {
                    type: 'SP.Data.NotesListItem'
                },
                Title: title,
                Notes: noteBody
            }),
            credentials: 'same-origin',
            headers: headers
        };

        return fetch(new Request(url, fetchSettings)).then(response => {
            return response
        });
    });
};

export const deleteFromSharepoint = (id, type, deleteUrl) => {
    const url = deleteUrl + '(\'' + type + '\')/Items(' + id + ')';

    return fetchDigest().then((digest) => {
        const fetchSettings = {
            method: 'POST',
            credentials: 'same-origin', // or credentials: 'include'
            headers: new Headers({
                "X-RequestDigest": digest,
                "IF-MATCH": "*",
                "X-HTTP-Method": "DELETE",
            })
        };
        return fetchBasic(url, fetchSettings, r => r);
    });
};
