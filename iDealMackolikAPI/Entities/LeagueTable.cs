namespace iDealMackolikAPI.Entities
{
	public class LeagueTable
	{
		public int LeagueTableId { get; set; }
		public int TeamId { get; set; }
		public int Played { get; set; }
		public int Won { get; set; }	
		public int Draw { get; set; }
		public int Lost { get; set; }
		public int GoalsFor { get; set; }
		public int GoalsAgainst { get; set; }
		public int GoalDifference { get; set; }
		public int Points { get; set; }
		public Team Team { get; set; }
		
	}
}
