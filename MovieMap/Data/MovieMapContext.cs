using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace MovieMap.Models
{
    public class MovieMapContext : DbContext
    {
        public MovieMapContext (DbContextOptions<MovieMapContext> options)
            : base(options)
        {
        }

        public DbSet<MovieMap.Models.Movie> Movie { get; set; }
    }
}
