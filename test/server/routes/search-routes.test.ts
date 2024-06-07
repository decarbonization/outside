import { describe, expect, it } from '@jest/globals';
import { SearchRoutes } from '../../../server/routes/search-routes';

describe("search-routes module", () => {
    describe("#SearchRoutes", () => {
        describe("#linkToGetSearchByQuery", () => {
            it("should include query when specified", () => {
                expect(SearchRoutes.linkToGetSearchByQuery("New York")).toStrictEqual('/search?q=New%20York');
            });
        });

        describe("#linkToGetSearchByCoordinates", () => {
            it("should not reduce precision of geo coordinates", () => {
                expect(SearchRoutes.linkToGetSearchByCoordinates({ latitude: 40.7129822, longitude: -74.007205 })).toStrictEqual('/search/40.7129822/-74.007205');
            });
        });
    });
});
