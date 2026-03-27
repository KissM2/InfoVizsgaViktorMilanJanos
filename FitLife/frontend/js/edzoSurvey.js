import {postKeres} from './kozosFetch.js';
import { marker } from './edzoteremValasztoMap.js';

document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('submit').addEventListener('click', function(e){
        e.preventDefault();
        let formData = new FormData(document.getElementById('edzoSurveyForm'));
        formData.append('edzoterem', {
            lat: marker.position.lat,
            lng: marker.position.lng
        });
        postKeres('/api/edzoData');
    });
});

