namespace iDealMackolikAPI.Entities
{
	public class Match
	{
		public int MatchId { get; set; }
		public int HomeTeamId { get; set; }
		public Team HomeTeam { get; set; }
		public int AwayTeamId { get; set; }
		public Team AwayTeam { get; set; }
		public DateTime MatchDate { get; set; }
		public string Stadium { get; set; }
		public int HomeScore { get; set; }
		public int AwayScore { get; set; }
		public int Status { get; set; }
		public int Week { get; set; }

		public List<MatchEvent> Events { get; set; }
		public MatchStatistic Statistic { get; set; }
	}
}
