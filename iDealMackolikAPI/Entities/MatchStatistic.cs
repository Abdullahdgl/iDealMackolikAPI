namespace iDealMackolikAPI.Entities
{
	public class MatchStatistic
	{
		public int MatchStatisticId { get; set; }
		public int MatchId { get; set; }
		public Match Match { get; set; }

		public int FirstHalfHomeGoals { get; set; }
		public int FirstHalfAwayGoals { get; set; }
	}
}
