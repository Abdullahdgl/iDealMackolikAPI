using iDealMackolikAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace iDealMackolikAPI.Context
{
	public class ApiContext : DbContext
	{
		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			optionsBuilder.UseSqlServer("Server=DESKTOP-7UIUM7T\\SQLEXPRESS;Database=ApiDbProject5;integrated security=true;trust server certificate=true");
		}

		
		//Migration yapacağımız tablolarım setleri ayarlandı.

		public DbSet<Team> Teams { get; set; }
		public DbSet<Match> Matches { get; set; }
		public DbSet<MatchEvent> MatchEvents { get; set; }
		public DbSet<MatchStatistic> MatchStatistics { get; set; }
		public DbSet<LeagueTable> LeagueTables { get; set; }


		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<Match>()
				.HasOne(x => x.HomeTeam)
				.WithMany(x => x.HomeMatches)
				.HasForeignKey(x => x.HomeTeamId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Match>()
				.HasOne(x=>x.AwayTeam)
				.WithMany(x=>x.AwayMatches)
				.HasForeignKey(x=>x.AwayTeamId)
				.OnDelete(DeleteBehavior.Restrict);

			base.OnModelCreating(modelBuilder);
			modelBuilder.Entity<LeagueTable>()
				.HasOne(x => x.Team)
				.WithMany()
				.HasForeignKey(x => x.TeamId);

		}

	}
}
