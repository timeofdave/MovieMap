using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace MovieMap.Models
{
    public class OmdbRating
    {
        public string Source { get; set; }
        public string Value { get; set; }
    }
    public class OmdbObject
    {
        public string Title { get; set; }
        public string Year { get; set; }
        public string Rated { get; set; }
        public string Released { get; set; }
        public string Runtime { get; set; }
        public string Genre { get; set; }
        public string Director { get; set; }
        public string Writer { get; set; }
        public string Actors { get; set; }
        public string Plot { get; set; }
        public string Language { get; set; }
        public string Country { get; set; }
        public string Awards { get; set; }
        public string Poster { get; set; }
        public OmdbRating[] Ratings { get; set; }
        public string Metascore { get; set; }
        public string imdbRating { get; set; }
        public string imdbVotes { get; set; }
        public string imdbID { get; set; }
        public string Type { get; set; }
        public string DVD { get; set; }
        public string BoxOffice { get; set; }
        public string Production { get; set; }
        public string Website { get; set; }
        public string Response { get; set; }
    }

    public class ExternalSource
    {
        private const string URL = "http://www.omdbapi.com/";
        private const string apiKey = "fakeKey";

        public static OmdbObject MakeRequest(string title, int year)
        {
            var safeTitle = Uri.EscapeDataString(title);

            using (var client = new HttpClient())
            {
                Uri url;
                if (year == 0)
                {
                    url = new Uri($"{URL}?t={safeTitle}&apikey={apiKey}");
                }
                else
                {
                    url = new Uri($"{URL}?t={safeTitle}&y={year}&apikey={apiKey}");
                }
                
                var response = client.GetAsync(url).Result;
                string json = "Empty";

                using (var content = response.Content)
                {
                    if (response.IsSuccessStatusCode)
                    {
                        // Parse the response body.
                        json = content.ReadAsStringAsync().Result;
                    }
                    else
                    {
                        Console.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
                        return null;
                    }
                }
                
                return JsonConvert.DeserializeObject<OmdbObject>(json);
            }
        }

        
    }
}