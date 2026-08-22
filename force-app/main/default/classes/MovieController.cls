public with sharing class MovieController {
    @TestVisible
    private static String getApiKey() {
        Movie_App_Setting__mdt setting = Movie_App_Setting__mdt.getInstance('Default');
        if (setting != null && String.isNotBlank(setting.API_Key__c)) {
            return setting.API_Key__c;
        }
        return '';
    }

    private static final String BASE_URL = 'https://api.themoviedb.org/3/movie/popular';

    @AuraEnabled(cacheable=true)
    public static String getPopularMovies(Integer page) {
        if (page == null || page < 1) {
            page = 1;
        }
        String apiKey = getApiKey();
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(BASE_URL + '?api_key=' + apiKey + '&language=en-US&page=' + page);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        return response.getBody();
    }
}
