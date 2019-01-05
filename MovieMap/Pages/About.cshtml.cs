using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MovieMap.Models;

namespace MovieMap.Pages
{
    public class AboutModel : PageModel
    {
        public string Message { get; set; }

        public void OnGet()
        {
            Message = "Your application description page.";
        }

        public void OnGetStuff()
        {
            Message = "OnGetStuff reporting for duty.";
        }

        public JsonResult OnGetFetchMovie(string title, int year)
        {
            var obj = ExternalSource.MakeRequest(title, year);
            
            return new JsonResult(obj);
        }
    }
}
