using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MovieMap.Models;

namespace MovieMap.Pages
{
    public class ContactModel : PageModel
    {
        public string Message { get; set; }

        public void OnGet()
        {
            var obj = ExternalSource.MakeRequest("Blade+Runner", 2017);
            Message = obj.Title;
        }
    }
}
