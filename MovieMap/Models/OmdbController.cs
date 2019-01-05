using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MovieMap.Models
{
    [Route("api/[controller]")]
    public class OmdbController : Controller
    {
        [HttpGet]
        [Route("random/{searchCritera}")]
        public IActionResult GetRandomGif(string searchCritera)
        {
            return Ok();
        }
    }
}
