namespace iDealMackolikAPI.Entities
{
	public class MatchEvent
	{
		public int MatchEventId { get; set; }
		public int MatchId { get; set; }
		public string EventType { get; set; }
		public string Description { get; set; }
		public int Munite { get; set; }
		public Match Match { get; set; }
	}
}
