@isTest
public class MovieControllerHttpMock implements HttpCalloutMock {
    private Integer statusCode;

    public MovieControllerHttpMock(Integer statusCode) {
        this.statusCode = statusCode;
    }

    public HttpResponse respond(HttpRequest request) {
        HttpResponse response = new HttpResponse();
        response.setStatusCode(this.statusCode);
        if (this.statusCode == 200) {
            response.setStatus('OK');
            response.setBody('{"page":1,"results":[{"id":123,"title":"Test Movie","backdrop_path":"/test.jpg","genre_ids":[28]}],"total_pages":10}');
        } else {
            response.setStatus('Bad Request');
            response.setBody('{"status_message":"Invalid API key"}');
        }
        return response;
    }
}
