@isTest
private class MovieControllerTest {
    @isTest
    static void testGetPopularMoviesSuccess() {
        Test.setMock(HttpCalloutMock.class, new MovieControllerHttpMock(200));

        Test.startTest();
        String result = MovieController.getPopularMovies(1);
        Test.stopTest();

        System.assertNotEquals(null, result, 'Response should not be null');
        System.assert(result.contains('Test Movie'), 'Response body should contain Test Movie');
    }

    @isTest
    static void testGetPopularMoviesDefaultPage() {
        Test.setMock(HttpCalloutMock.class, new MovieControllerHttpMock(200));

        Test.startTest();
        String result = MovieController.getPopularMovies(null);
        Test.stopTest();

        System.assertNotEquals(null, result, 'Response should not be null for null page');
    }

    @isTest
    static void testGetPopularMoviesErrorStatus() {
        Test.setMock(HttpCalloutMock.class, new MovieControllerHttpMock(400));

        Boolean exceptionThrown = false;
        Test.startTest();
        try {
            MovieController.getPopularMovies(1);
        } catch (AuraHandledException e) {
            exceptionThrown = true;
        }
        Test.stopTest();

        System.assertEquals(true, exceptionThrown, 'AuraHandledException should be thrown on 400 response');
    }

    @isTest
    static void testGetApiKey() {
        String key = MovieController.getApiKey();
        System.assertNotEquals(null, key, 'API key helper should return a non-null string');
    }
}
