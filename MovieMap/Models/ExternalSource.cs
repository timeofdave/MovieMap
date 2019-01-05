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
        private const string apiKey = "ab48854d";

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



        /*
        public static string MakeRequest2(string title, string year)
        {
            string result = "Empty";

            HttpClient client = new HttpClient();
            //client.BaseAddress = new Uri(URL);

            // Add an Accept header for JSON format.
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            string urlParameters = "?t=" + title + "&y=" + year + "&apikey=ab48854d";

            // List data response.
            HttpResponseMessage response = client.GetAsync(URL + urlParameters).Result;  // Blocking call! Program will wait here until a response is received or a timeout occurs.
            if (response.IsSuccessStatusCode)
            {
                // Parse the response body.
                var dataObjects = response.Content.ReadAsAsync<IEnumerable<OmdbObject>>().Result;  //Make sure to add a reference to System.Net.Http.Formatting.dll
                foreach (var d in dataObjects)
                {
                    Console.WriteLine("{0}", d.Title);
                    result = d.Title;
                }
            }
            else
            {
                Console.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
            }

            //Make any other calls using HttpClient here.

            //Dispose once all HttpClient calls are complete. This is not necessary if the containing object will be disposed of; for example in this case the HttpClient instance will be disposed automatically when the application terminates so the following call is superfluous.
            client.Dispose();

            return result;
        }
        */
    }
}